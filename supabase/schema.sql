-- Dalitso Malama's showcase site — schema + RLS policies
-- Run this once against a fresh Supabase project (SQL Editor or `supabase db push`).
--
-- Security model: this app has exactly one admin, created manually in the
-- Supabase dashboard (Authentication → Users). There is no sign-up flow
-- anywhere in the app, so any successfully *authenticated* request is, by
-- definition, the admin. RLS policies below use `auth.role() = 'authenticated'`
-- for admin-only writes on that basis — see ARCHITECTURE.md §9.

create extension if not exists "pgcrypto";

-- ── projects ────────────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  problem text,
  solution text,
  outcome text, -- delta from ARCHITECTURE.md §4: FR-6/acceptance criteria require a distinct outcome/impact section
  -- delta: organization/period/note/gallery_images. Case studies are employer
  -- systems that need "who / when" context, several (redacted) screenshots,
  -- and a note on what's blurred — none of which fit in the original columns.
  organization text,
  period text,
  note text,
  tech_stack text[] not null default '{}',
  video_youtube_id text,
  cover_image_url text, -- absolute URL or a root-relative /public path
  gallery_images text[] not null default '{}',
  figure text, -- delta: a hairline figure name (lib/figures.ts), the cover when there is no image
  demo text, -- delta: an interactive simulation name (lib/demos.ts) embedded in the case study
  featured boolean not null default false,
  published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade path for databases created before the delta columns above existed.
alter table projects add column if not exists organization text;
alter table projects add column if not exists period text;
alter table projects add column if not exists note text;
alter table projects add column if not exists gallery_images text[] not null default '{}';
alter table projects add column if not exists figure text;
alter table projects add column if not exists demo text;

alter table projects enable row level security;

create policy "projects_public_select_published"
  on projects for select
  to anon, authenticated
  using (published = true);

create policy "projects_admin_select_all"
  on projects for select
  to authenticated
  using (true);

create policy "projects_admin_write"
  on projects for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── ideas ───────────────────────────────────────────────────────────────────
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  submitter_name text,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'in_the_lab', 'shipped', 'declined')),
  vote_count int not null default 0,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table ideas enable row level security;

create policy "ideas_public_select_approved"
  on ideas for select
  to anon, authenticated
  using (approved = true and status <> 'declined');

create policy "ideas_public_insert"
  on ideas for insert
  to anon, authenticated
  with check (approved = false and status = 'submitted');

create policy "ideas_admin_select_all"
  on ideas for select
  to authenticated
  using (true);

create policy "ideas_admin_update"
  on ideas for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── idea_votes ──────────────────────────────────────────────────────────────
create table if not exists idea_votes (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  session_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (idea_id, session_fingerprint)
);

alter table idea_votes enable row level security;

create policy "idea_votes_public_insert"
  on idea_votes for insert
  to anon, authenticated
  with check (true);

-- No select/update/delete policy for idea_votes at all: nobody can read vote
-- rows back over the API (not even the admin needs to — vote_count on ideas
-- is the aggregate of record).

-- Atomic increment, callable by anon/authenticated, but the only thing it can
-- do is bump vote_count by 1 for a given idea — narrow enough to be safe as
-- SECURITY DEFINER even though the ideas table itself blocks anon updates.
create or replace function increment_vote_count(p_idea_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ideas set vote_count = vote_count + 1 where id = p_idea_id;
end;
$$;

revoke all on function increment_vote_count(uuid) from public;
grant execute on function increment_vote_count(uuid) to anon, authenticated;

-- ── idea_rate_limit ─────────────────────────────────────────────────────────
-- Server-only bookkeeping table (no RLS policies at all beyond RLS-enabled +
-- no grants), written exclusively via the service-role key from
-- lib/rateLimit.ts. Never exposed to anon/authenticated roles.
create table if not exists idea_rate_limit (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

alter table idea_rate_limit enable row level security;
create index if not exists idea_rate_limit_ip_hash_created_at_idx
  on idea_rate_limit (ip_hash, created_at);

-- ── site_content ────────────────────────────────────────────────────────────
-- Small KV store for owner-editable text that doesn't warrant its own table:
-- manifesto (home page), about (bio page), cv_entries (CV timeline, jsonb array),
-- profile (name/headline/contact/highlights), skills, education, certifications.
-- Shapes are enforced per key in lib/validation/content.ts.
create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "site_content_public_select"
  on site_content for select
  to anon, authenticated
  using (true);

create policy "site_content_admin_write"
  on site_content for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── storage: project images ─────────────────────────────────────────────
-- delta: lets the admin upload screenshots/photos from /admin instead of
-- committing them to /public. Public read (the site shows them); only the
-- authenticated admin can add or remove. Size and type are enforced by the
-- bucket as well as by app/api/admin/uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "project_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

create policy "project_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "project_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- ── updated_at trigger for projects ─────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();
