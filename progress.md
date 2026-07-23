# Progress

## Status: MVP scaffold complete, unverified against a live Supabase project

Built per `REQUIREMENTS.md` / `ARCHITECTURE.md`: home, Systems Lab (+ case
studies), Ideas portal (submit/vote/moderate), CV (+ PDF export), About, and
a single-admin CMS (project CRUD, idea moderation, site content editor).

`npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass. Every
public route and the admin login gate were smoke-tested in a browser against
local fixture data (`lib/data/fixtures.ts`) — see "Tested" below.

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
