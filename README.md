# dalitsomalama.dev — Mwenya Dalitso Malama's showcase site

Next.js 16 (App Router, TypeScript) + Supabase site: a "Systems Lab" project
showcase with video case studies, a public Ideas portal (submit/upvote/moderate),
a CV with PDF export, and a single-admin CMS. See `REQUIREMENTS.md` and
`ARCHITECTURE.md` for the full spec this was built against.

## Local development

```bash
npm install
npm run dev
```

Runs immediately with **no external services** — when `NEXT_PUBLIC_SUPABASE_URL`
is unset, all pages render from local fixture data (`lib/data/fixtures.ts`) and
Turnstile/rate-limiting fall back to permissive dev-only stubs (never in
production — see `lib/turnstile.ts` / `lib/rateLimit.ts`). The admin login form
will say Supabase isn't configured until you wire up a real project below.

## Wiring up real services (required before deploying)

1. **Supabase** — create a free project at supabase.com.
   - Run `supabase/schema.sql` in the SQL editor (tables, RLS policies, the
     vote-increment function).
   - Optionally run `supabase/seed.sql` for placeholder content.
   - Create the single admin user manually: Authentication → Users → Add user.
     There is no sign-up flow anywhere in the app — this is the only account
     that will ever exist.
   - Copy the Project URL, anon key, and service-role key into `.env.local`
     (copy `.env.example` first).
2. **Cloudflare Turnstile** — create a widget at the Turnstile dashboard, add
   the site key and secret key to `.env.local`.
3. **YouTube** — upload walkthrough videos as **unlisted**, paste the video ID
   into each project's `video_youtube_id` field from `/admin`.
4. Generate a random `SESSION_HASH_SALT` (command in `.env.example`) — this
   salts hashed IPs/session fingerprints so raw values are never stored.

## Deploying

1. Push to GitHub, import into Vercel.
2. Set all variables from `.env.example` in Vercel's project settings.
3. Deploy — case study/CV/home pages are statically generated with ISR
   (revalidate every few minutes), so admin edits appear without a redeploy.

## Structure

- `app/(public)/*` — home, systems lab, ideas, CV, about (SSG/ISR).
- `app/admin/*` — login-gated dashboard: project CRUD, idea moderation, site content.
- `app/api/*` — Route Handlers: idea submission/voting (public, rate-limited +
  Turnstile-gated) and admin CRUD/moderation (session-checked server-side).
- `lib/data/*` — data access, with automatic fixture fallback when Supabase
  isn't configured.
- `supabase/schema.sql` — full schema + RLS policies + the `site_content` and
  `idea_rate_limit` tables (small additions beyond `ARCHITECTURE.md` §4 — see
  inline comments for why).
