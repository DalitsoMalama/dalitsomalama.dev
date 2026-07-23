# Architecture — Epy's Developer Showcase Site

**Audience:** this document is written to be handed directly to Claude Code (or any engineer) as the build spec. It assumes no prior context beyond what's written here.

**Companion document:** see `REQUIREMENTS.md` for functional/non-functional requirements and acceptance criteria. This document covers the technical shape; that one covers what it must do.

---

## 1. Goals and constraints

- Zero recurring hosting cost at portfolio-level traffic (a few thousand visits/month).
- Fast to ship an MVP, then iterate (systems lab first, ideas portal second).
- Owner (Epy) needs a private admin surface to add/edit projects and moderate ideas — no separate CMS product, keep it inside the same codebase.
- Content is mostly static (project case studies, CV) with two dynamic surfaces (ideas portal, admin).

## 2. High-level architecture

```
┌─────────────┐      ┌──────────────────────────┐      ┌───────────────────────┐
│   Visitor    │─────▶│  Next.js app (Vercel)     │─────▶│  Supabase (free tier)  │
│  (browser)   │      │  App Router, SSG + ISR    │      │  Postgres + Auth +     │
└─────────────┘      │  for case studies          │      │  Storage (RLS-secured) │
                      └──────────────┬────────────┘      └───────────────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────┐
                      │  YouTube (unlisted)       │
                      │  video hosting, embedded  │
                      └──────────────────────────┘
```

Two write paths hit Supabase directly: idea submissions (public, rate-limited, Turnstile-gated) and admin CRUD (authenticated). Everything else — case studies, CV, home — is statically generated at build time or on-demand revalidated (ISR), so the vast majority of traffic never touches the database.

## 3. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15+, App Router, TypeScript | SSG for case studies/CV, dynamic routes for ideas portal + admin |
| Styling | Tailwind CSS | Utility-first, fast to theme dark-mode-first |
| Animation | Framer Motion | Scroll-triggered reveals; respect `prefers-reduced-motion` |
| Database | Supabase Postgres (free tier) | Single project, RLS enabled on every table |
| Auth | Supabase Auth (email/password or magic link) | Single admin user, no public signup |
| Bot protection | Cloudflare Turnstile (free) | On the idea submission form only |
| Video | YouTube, unlisted uploads | Embedded via `<iframe>` wrapper component; zero bandwidth cost to us |
| Hosting | Vercel (free tier / Hobby plan) | Auto-deploy from GitHub main branch |
| CI/CD | GitHub Actions or Gitea Actions on PEGASUS | Lint + typecheck + build on PR; Vercel handles deploy itself |
| Analytics (optional) | Vercel Analytics free tier | Skip if not needed at launch |

No custom backend server. Next.js Route Handlers (`app/api/*`) are the only server-side logic, running as Vercel serverless/edge functions.

## 4. Data model (Supabase / Postgres)

```sql
-- Projects (systems lab case studies)
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,           -- one-line, used on cards
  problem text,                    -- long-form case study sections
  solution text,
  tech_stack text[],
  video_youtube_id text,           -- YouTube video ID, nullable
  cover_image_url text,
  featured boolean default false,  -- shows on homepage highlight reel
  published boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ideas portal submissions
create table ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  submitter_name text,             -- nullable, anonymous allowed
  status text not null default 'submitted'
    check (status in ('submitted','under_review','in_the_lab','shipped','declined')),
  vote_count int default 0,
  approved boolean default false,  -- must be true to show in public feed
  created_at timestamptz default now()
);

-- One vote per browser session per idea (soft dedupe, not auth-backed)
create table idea_votes (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references ideas(id) on delete cascade,
  session_fingerprint text not null,  -- hashed client fingerprint, not PII
  created_at timestamptz default now(),
  unique(idea_id, session_fingerprint)
);
```

### Row-Level Security (RLS)

- `projects`: public `select` where `published = true`. All writes require the authenticated admin role.
- `ideas`: public `insert` allowed (rate-limited at the API layer, see §6). Public `select` only where `approved = true`. `update`/`delete` require admin role.
- `idea_votes`: public `insert` allowed; no public `select`/`update`/`delete`.

## 5. Route map

```
/                          → home: manifesto + highlight reel (featured projects)
/systems                   → systems lab index (bento grid of published projects)
/systems/[slug]            → case study page (problem → solution → video → stack → outcome)
/ideas                     → public ideas feed (approved, sorted by votes or recency)
/ideas/submit              → submission form (Turnstile-gated)
/cv                        → interactive timeline + "download PDF" button
/about                     → short bio
/admin                     → login-gated dashboard: project CRUD + idea moderation queue
/admin/projects/[id]       → edit a project
/admin/ideas               → moderation queue (approve/reject, set status)
```

## 6. API / server logic (Next.js Route Handlers)

- `POST /api/ideas` — validates payload, verifies Turnstile token server-side, rate-limits by IP (e.g. 5 submissions/hour), inserts into `ideas` with `approved = false`.
- `POST /api/ideas/[id]/vote` — inserts into `idea_votes` keyed by a hashed session fingerprint (cookie-based, not personally identifying); increments `vote_count` via a Postgres function or trigger to avoid race conditions.
- `POST /api/admin/ideas/[id]/moderate` — admin-only (checked via Supabase session), sets `approved`/`status`.
- `POST /api/admin/projects` / `PUT /api/admin/projects/[id]` — admin-only project CRUD.
- Public GETs for case studies and CV data go through Next.js data-fetching at build/request time directly against Supabase — no custom GET endpoints needed.

## 7. Rendering strategy

- `/`, `/systems`, `/systems/[slug]`, `/cv`, `/about` → **Static Generation with ISR** (revalidate every few minutes), so admin edits show up without a full redeploy.
- `/ideas` → ISR with a short revalidate window (near-real-time feed without hitting the DB on every request).
- `/ideas/submit`, `/admin/*` → dynamic, no caching.

## 8. Video handling

- Videos are uploaded directly to YouTube as **unlisted** (not private, not public) — accessible via direct link/embed, excluded from search and channel listings.
- Store only the YouTube video ID in `projects.video_youtube_id`.
- Build a thin `<VideoEmbed>` component wrapping the YouTube iframe (lazy-loaded, `loading="lazy"`, poster/thumbnail shown until clicked to avoid loading the YouTube player on every card).

## 9. Security notes

- Admin is a single Supabase Auth user; no public registration path exists anywhere in the app.
- All admin routes check session server-side in the Route Handler / middleware, not just client-side.
- Turnstile secret key and Supabase service-role key live in Vercel environment variables, never shipped to the client.
- Public-facing Supabase calls (idea submission, voting, reading published content) use the **anon key** only, constrained entirely by RLS policies — the service-role key is used only in admin-authenticated server code.

## 10. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never exposed to client
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## 11. Deployment

1. Push repo to GitHub.
2. Create Supabase project (free tier), run schema migration (§4), enable RLS policies (§4).
3. Import repo into Vercel, set environment variables (§10), deploy.
4. Point custom domain (if any) at Vercel; Vercel issues free SSL automatically.

## 12. Folder structure (suggested)

```
/app
  /(public)
    /page.tsx                → home
    /systems/page.tsx
    /systems/[slug]/page.tsx
    /ideas/page.tsx
    /ideas/submit/page.tsx
    /cv/page.tsx
    /about/page.tsx
  /admin
    /page.tsx
    /projects/[id]/page.tsx
    /ideas/page.tsx
  /api
    /ideas/route.ts
    /ideas/[id]/vote/route.ts
    /admin/ideas/[id]/moderate/route.ts
    /admin/projects/route.ts
/components
  VideoEmbed.tsx
  ProjectCard.tsx
  IdeaCard.tsx
  TurnstileWidget.tsx
/lib
  supabase/client.ts
  supabase/server.ts
  rateLimit.ts
```
