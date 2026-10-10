# Progress

## Status: personalised for Mwenya Dalitso Malama; unverified against a live Supabase project

## Personalisation (2026-10-10)

Rebranded from the "Epy" placeholder to dalitsomalama.dev with real content
taken from Dalitso's CVs and project portfolio:

- 9 case studies (Nkana Water, IKAL Solutions, CBU) with redacted screenshots
  in `public/projects/<slug>/`. Blurred: customer names/accounts/balances,
  staff names, kwacha figures and chart scales, personal details on the
  attendance form. Kwacha figures are also kept out of all text — the owner
  asked for financial figures to stay private.
- Schema delta: `projects.organization`, `period`, `note`, `gallery_images`
  (with `add column if not exists` for existing DBs).
- New `site_content` keys: `profile`, `skills`, `education`,
  `certifications`, each zod-validated per key in the admin content API.
- CV page + PDF now render skills/education/certs; referees are "available on
  request" (no third-party phone numbers published). No home address.
- `supabase/seed.sql` regenerated from fixtures so a fresh project starts
  with the same content as local dev.
- Verified: lint, tsc, build clean; all routes 200 in dev; PDF renders on 2
  pages; no horizontal overflow at 375px.

Built per `REQUIREMENTS.md` / `ARCHITECTURE.md`: home, Systems Lab (+ case
studies), Ideas portal (submit/vote/moderate), CV (+ PDF export), About, and
a single-admin CMS (project CRUD, idea moderation, site content editor).

`npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass. Every
public route and the admin login gate were smoke-tested in a browser against
local fixture data (`lib/data/fixtures.ts`) — see "Tested" below.

## Nav + contact options (2026-10-10)

- Nav: Home added; "CV" renamed Portfolio and moved to `/portfolio`
  (`/cv` → 308 redirect in `next.config.ts` so shared links keep working).
- Profile gained `phones` and `whatsapp`. "Get in touch" (footer, About) now
  offers: email (Copy / Email me → mailto), Chat on WhatsApp (wa.me with a
  pre-typed greeting) and tap-to-call numbers. Verified hrefs, redirect, and
  no overflow at 360px.

## Admin image uploads + project facts (2026-10-10)

- `/admin` project form can upload cover and gallery images (JPEG/PNG/WebP,
  ≤5 MB) to the public `project-images` Supabase Storage bucket via
  `POST /api/admin/uploads` (admin session required; 401 verified). Bucket +
  storage policies added to `schema.sql` (delta). Not yet tested end-to-end —
  needs a real Supabase project.
- Water Quality IoT Monitor corrected: Copperbelt University, 2023 third-year
  group project, tested on a CBU fish pond for a week (now its outcome).
  Removed the wrongly-added IKAL CV highlight; About text updated.
- Systems Lab filter now groups organisations by short name (one
  "Copperbelt University" chip).

## Playground + water-quality project (2026-10-10)

- `/playground` (nav: Playground) hosts interactive simulations on generated
  data. Projects opt in via the new `projects.demo` column (names in
  `lib/demos.ts`, components in `components/demos/`).
- Meter discrepancy playground: 2,000 seeded readings, 8 fictional branches,
  live re-classification by threshold sliders; embedded as "Try it yourself"
  on its case study.
- The air-quality project was replaced (per Dalitso) by the Water Quality IoT
  Monitor (ESP32 + pH, turbidity, ammonia probes). Its simulation is the case
  study hero and the project card thumbnail; auto-loops clean → runoff →
  alerts → treatment, or visitors drive it. CV/About mentions updated.
- Verified in headless Chrome: readings drift into alert during runoff,
  sliders re-classify (80.5% → 46.3% accepted), no console errors, no page
  overflow at 390px; build clean.

## Jar Test game (2026-10-10)

- `components/demos/JarTest.tsx`: a canvas mini-game on `/playground`
  ("Side quest" section, not tied to a project, so not in `lib/demos.ts`).
  Five generated raw-water samples per shift, three jars each: pick an alum
  dose, watch rapid mix → slow mix → settle, aim for ≤ 5 NTU settled with
  little wasted coagulant. Under/overdose give distinct floc behaviour and
  hints. Pauses offscreen; reduced motion skips straight to the result.
- Verified in the browser: full shift plays to the shift report, hints match
  pass/fail, light/dark, no overflow at 375px, no console errors.

## Visual redesign (2026-10-10)

Phase 1 of `docs/ROADMAP.md`: typography system (Instrument Serif accent),
flow-field hero canvas, pointer spotlight backdrop, magnetic CTAs, animated
nav, scroll progress, page transitions, count-up stats, marquee, editorial
case studies with next-project hand-off, filterable Systems Lab, closing
footer. Profile gained `tagline` and `availability` (getProfile merges over
the fixture so older saved profiles still render).
Verified with headless Chrome full-page shots in light/dark at 1440 and 390px:
no console errors, no horizontal overflow. Phases 2–6 await approval.

## Light mode (2026-10-10)

- Every colour token in `app/globals.css` is `light-dark(light, dark)`;
  the page follows the system until the nav toggle (`ThemeToggle`) saves a
  choice to localStorage and sets `data-theme` on `<html>`. A head script in
  `app/layout.tsx` applies the saved choice before paint (no flash).
- Hard-coded amber/emerald badge colours replaced by `--warning`/`--success`.
- Hairline figures follow automatically (their tokens are light-dark too).
- Verified: system light renders light; toggle switches live and survives
  reload; no hydration warnings; build clean.

## Hairline figures (2026-10-10)

- Added `@lucasmarkes/hairline@0.5.0` (exact pin). `Format` animates beside
  the Ideas header; the Air Quality project (no screenshots) uses `Router` as
  its cover via the new `projects.figure` column (schema delta, nullable).
- `hairline-create` skill vendored into `.claude/skills/` after review;
  `.claude/**` excluded from ESLint.
- Verified: lint/tsc/build clean; figures render with accent highlight,
  card heights stay aligned, no console errors.
- Next: a bespoke air-quality figure via the skill to replace `Router`.

## Deltas from the original spec (all called out inline in code/README too)

- Added `site_content` table (KV: manifesto/about/cv_entries) — the spec had
  no storage for owner-editable text outside `projects`/`ideas` (NFR-7 gap).
- Added `idea_rate_limit` table — serverless functions can't share an
  in-memory counter, so rate limiting is backed by Postgres instead.
- Added `projects.outcome` column — FR-6/acceptance criteria call for a
  distinct outcome/impact section the original schema didn't have a field for.
- Next.js scaffolded at v16.2.11 (spec said "15+"). Notable v16 changes this
  build already accounts for: `middleware.ts` → `proxy.ts` (renamed, done),
  `params`/`searchParams` are mandatory `Promise`s (done throughout).

## Tested (2026-07-23, local fixtures, no real Supabase project)

- Home, Systems Lab index, case study pages (all 3 fixture projects),
  Ideas feed (both sort orders), Ideas submit form, CV page + PDF download
  (verified as a real valid PDF via `file`), About.
- Idea submission and voting: confirmed these fail gracefully (500 → clean
  client error, no crash) since they're write paths that need a real
  Supabase project — expected in mock mode, not a bug.
- Admin: `/admin` shows the "not configured" message instead of crashing
  (this was a real bug — see Fixed below); `/admin/ideas` etc. correctly
  redirect to `/admin` via `proxy.ts` when unauthenticated.

## Fixed during testing

1. **`/admin` crashed** when Supabase wasn't configured — `getAdminUser()`
   called `createServerSupabaseClient()` unconditionally, which throws on
   missing env vars. Fixed by short-circuiting in `lib/auth.ts` when
   `isSupabaseConfigured()` is false.
2. **No mobile nav** — `components/Nav.tsx` rendered all 4 links + logo in
   one non-wrapping row with no small-screen fallback. Added a hamburger
   menu (`sm:hidden` / `hidden sm:flex`) that auto-closes on route change.

## Not yet tested / not possible without more setup

- Full admin CRUD flow (create/edit/publish a project, moderate an idea)
  end-to-end against a real Supabase project + real admin user.
- Turnstile in its real (non-bypass) mode.
- Rate limiting under actual repeated requests (Postgres-backed logic is
  written and reviewed, not load-tested).
- Visual confirmation of the mobile nav at a true phone viewport width, and
  of the custom accent-colored focus ring — the browser automation tool used
  for testing couldn't shrink its viewport below ~1200px and appears to
  override outline rendering itself (even a forced inline style didn't show
  through), so both are logic-verified but not screenshot-verified.

## Next steps (see README.md for the full checklist)

1. Create a Supabase project, run `supabase/schema.sql`, create the one
   admin user by hand, drop credentials into `.env.local`.
2. Get Cloudflare Turnstile keys.
3. Re-run the admin CRUD + ideas moderation flow end-to-end against real data.
4. Upload real project walkthrough videos to YouTube (unlisted), fill in
   real case-study content and CV entries from `/admin`.
5. Deploy to Vercel.
