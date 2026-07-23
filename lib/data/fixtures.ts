// Dev-only sample content, used when NEXT_PUBLIC_SUPABASE_URL is unset so
// `npm run dev` renders realistic pages with zero external setup. Never used
// once Supabase is configured — see isSupabaseConfigured() call sites below.
import type { CvEntry, Idea, Project } from "@/lib/types";

export const fixtureProjects: Project[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "pegasus-ci-runner",
    title: "PEGASUS CI Runner",
    summary: "Self-hosted Gitea Actions runner fleet with zero-downtime deploys.",
    problem:
      "The team's CI was tied to a rate-limited hosted runner and deploys required manual SSH steps that regularly drifted from what was actually in git.",
    solution:
      "Built a self-hosted Gitea Actions runner cluster with a declarative deploy pipeline: every merge to main triggers a build, health-checked rollout, and automatic rollback on failed health checks.",
    outcome:
      "Deploy time dropped from a 20-minute manual SSH ritual to under 3 minutes, fully automated, with zero failed deploys reaching production since rollout.",
    tech_stack: ["Gitea Actions", "Docker", "Bash", "Caddy"],
    video_youtube_id: null,
    cover_image_url: null,
    featured: true,
    published: true,
    display_order: 1,
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "idea-portal-vote-dedup",
    title: "Idea Portal Vote Dedup",
    summary: "Anonymous, session-fingerprinted upvoting without user accounts.",
    problem:
      "Wanted a public idea board where anyone could upvote without creating an account, but needed to prevent trivial vote stuffing.",
    solution:
      "Hashed, salted session fingerprints stored server-side with a unique constraint per idea, backed by an atomic Postgres increment function to avoid race conditions under concurrent votes.",
    outcome:
      "Zero duplicate votes recorded under load testing with concurrent requests, with no user accounts required.",
    tech_stack: ["Next.js", "Supabase", "Postgres"],
    video_youtube_id: null,
    cover_image_url: null,
    featured: true,
    published: true,
    display_order: 2,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "serverless-rate-limiter",
    title: "Serverless-Friendly Rate Limiter",
    summary: "IP-hashed rate limiting that survives stateless function instances.",
    problem:
      "Vercel functions don't share memory between invocations, so a naive in-process rate limiter silently stops working under real traffic.",
    solution:
      "Moved rate-limit bookkeeping into Postgres itself — a lightweight table of hashed-IP + timestamp rows, queried per request, so the limiter is correct regardless of which serverless instance handles the request.",
    outcome: "Correctly blocks abusive submission bursts in production, unlike the in-memory version it replaced.",
    tech_stack: ["Postgres", "Next.js Route Handlers"],
    video_youtube_id: null,
    cover_image_url: null,
    featured: false,
    published: true,
    display_order: 3,
    created_at: "2026-03-05T00:00:00Z",
    updated_at: "2026-03-05T00:00:00Z",
  },
];

export const fixtureIdeas: Idea[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Automate my home network's DNS blocklist updates",
    description:
      "Pull down a curated blocklist weekly and reload Pi-hole automatically, with a diff sent somewhere I'll actually see it.",
    submitter_name: "Anonymous",
    status: "in_the_lab",
    vote_count: 14,
    approved: true,
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "Slack bot that summarizes overnight CI failures",
    description:
      "One message per morning: what broke overnight across all repos, grouped by root cause if possible.",
    submitter_name: "Jordan",
    status: "under_review",
    vote_count: 9,
    approved: true,
    created_at: "2026-06-10T00:00:00Z",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    title: "Receipt OCR to auto-categorize expenses",
    description:
      "Photograph a receipt, get it categorized and dropped into a spreadsheet without manual entry.",
    submitter_name: null,
    status: "shipped",
    vote_count: 22,
    approved: true,
    created_at: "2026-05-15T00:00:00Z",
  },
];

export const fixtureManifesto =
  "I build systems that ship, not slideware. Everything on this site is a real, running project — this text, the case studies, and even this sentence are editable from the admin panel without a redeploy.";

export const fixtureAbout =
  "I'm Epy, an engineer who likes turning messy, manual processes into small reliable systems. This site is one of them — a Next.js + Supabase showcase where the case studies, CV, and even the ideas you submit below feed back into what I build next.";

export const fixtureCvEntries: CvEntry[] = [
  {
    role: "Software Engineer",
    organization: "Independent / Contract",
    start_date: "2024-01",
    end_date: null,
    summary:
      "Building automation systems and developer tooling for small teams, end to end — infra, backend, and UI.",
    highlights: [
      "Designed and ran a self-hosted CI/CD pipeline serving multiple repos",
      "Shipped several full-stack Next.js + Postgres applications solo",
    ],
  },
  {
    role: "Software Engineer",
    organization: "Previous Company",
    start_date: "2021-06",
    end_date: "2023-12",
    summary: "Backend and platform engineering on a small product team.",
    highlights: [
      "Reduced deploy time from 40 minutes to under 5",
      "Led migration of the primary datastore with zero downtime",
    ],
  },
];
