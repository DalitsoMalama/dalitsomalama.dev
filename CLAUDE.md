@AGENTS.md

# dalitsomalama.dev — Mwenya Dalitso Malama's showcase site

Next.js 16 (App Router) + Supabase. Full spec: `REQUIREMENTS.md` +
`ARCHITECTURE.md`. Current state and known gaps: `progress.md` — read it
before starting new work.

## Commands

- `npm run dev` — runs with zero setup; falls back to `lib/data/fixtures.ts`
  when Supabase env vars are unset.
- `npm run lint` / `npx tsc --noEmit` / `npm run build` — all must stay clean.
  **Stop the dev server before `npm run build`** — building while `next dev`
  runs corrupted `.next` once (every route 404'd until `.next` was deleted).

## Conventions specific to this repo

- **Fixture fallback pattern**: every read in `lib/data/*.ts` checks
  `isSupabaseConfigured()` and falls back to fixtures. Every *write* path
  (`submitIdea`, `voteForIdea`, admin CRUD) does not — it needs a real
  Supabase project and fails with a clean error otherwise. Keep new data
  functions consistent with this split.
- **Admin auth**: `lib/auth.ts#getAdminUser()` must short-circuit on
  `!isSupabaseConfigured()` before touching the Supabase client — it crashed
  the `/admin` page once already when this guard was missing.
- **`proxy.ts`, not `middleware.ts`** — Next 16 renamed it. Guards
  `/admin/projects`, `/admin/ideas`, `/admin/content` only; `/admin` itself
  renders its own login-or-dashboard branch server-side.
- **Schema deltas from ARCHITECTURE.md** (documented inline in
  `supabase/schema.sql`): `site_content` KV table, `idea_rate_limit` table,
  `projects.outcome` column. Don't "fix" these back to match the doc — they
  cover real gaps (see `progress.md`).
- Single admin user only, created manually in the Supabase dashboard — never
  add a sign-up path.
- **Real content lives in `lib/data/fixtures.ts`** (Dalitso's actual case
  studies, CV, profile — not throwaway samples). `supabase/seed.sql` is
  generated from it; regenerate rather than hand-editing when content changes.
- **Every `site_content` key needs a zod schema** in
  `lib/validation/content.ts` — the admin API rejects keys/shapes not listed
  there, since public pages render these values directly.
- **Screenshots in `public/projects/` are redacted** (customer details, staff
  names, kwacha figures, personal IDs blurred). Employer systems are internal
  — never add an unredacted screenshot or publish financial figures.
- **Hairline figures** (`@lucasmarkes/hairline`, pinned exact — pre-1.0):
  `components/Figure.tsx` maps `projects.figure` names to components; the
  allowed names live in `lib/figures.ts` (zod + admin form read them). Colours
  are the `--hairline-*` tokens in `app/globals.css`; override
  `--hairline-plate` on any container whose background isn't `--background`.
  New bespoke figures come from the `hairline-create` skill in
  `.claude/skills/` and are standalone HTML until wrapped for the app.
- **Design system** (see `docs/ROADMAP.md` Phase 1): `.display` headings with
  `<em>` rendered as the Instrument Serif italic accent, `.eyebrow` labels,
  `Spotlight` for hover surfaces, `MotionReveal` for scroll reveals. Every
  animation needs a reduced-motion path; canvas/rAF work must pause offscreen.
- **Demos** (`components/demos/`): interactive simulations run on generated
  data only — never real Nkana Water readings, accounts or branch figures.
  Add a name to `lib/demos.ts`, a case to `components/demos/Demo.tsx`, and
  set `projects.demo`. They must pause offscreen (IntersectionObserver).
