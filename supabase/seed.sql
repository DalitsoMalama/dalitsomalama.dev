-- Optional sample data for a freshly-created Supabase project. Safe to skip —
-- the app renders local fixtures automatically when Supabase isn't configured
-- (see lib/data/fixtures.ts), so this is only useful once you're testing
-- against a real project and want something other than an empty database.

insert into site_content (key, value) values
  ('manifesto', '"I build systems that ship, not slideware. This text is editable from /admin without a redeploy."'),
  ('about', '"Short bio goes here — edit from /admin."'),
  ('cv_entries', '[]')
on conflict (key) do nothing;

insert into projects (slug, title, summary, problem, solution, outcome, tech_stack, featured, published, display_order) values
  (
    'sample-project',
    'Sample Project',
    'A one-line summary shown on the project card.',
    'What problem did this solve?',
    'How was it solved?',
    'What changed as a result?',
    array['Next.js', 'Supabase'],
    true,
    true,
    1
  )
on conflict (slug) do nothing;
