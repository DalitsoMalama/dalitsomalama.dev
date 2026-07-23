@AGENTS.md

# Epy's Developer Showcase Site

Next.js 16 (App Router) + Supabase. Full spec: `REQUIREMENTS.md` +
`ARCHITECTURE.md`. Current state and known gaps: `progress.md` — read it
before starting new work.

## Commands

- `npm run dev` — runs with zero setup; falls back to `lib/data/fixtures.ts`
  when Supabase env vars are unset.
- `npm run lint` / `npx tsc --noEmit` / `npm run build` — all must stay clean.

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
