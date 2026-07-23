# User Requirements Document — Epy's Developer Showcase Site

**Companion document:** see `ARCHITECTURE.md` for the technical implementation this spec should be built against.

## 1. Purpose

A public website that showcases Epy's engineering work through video-backed case studies, presents a CV, and runs a public "ideas portal" where visitors submit automation ideas that Epy can pick up and build. The site should read as evidence of real, shipped systems — not a template portfolio.

## 2. Users

- **Visitor (public, unauthenticated)** — browses case studies, watches videos, views CV, submits and upvotes ideas.
- **Admin (Epy only, authenticated)** — adds/edits/publishes projects, moderates idea submissions, updates status of ideas.

## 3. Functional requirements

### 3.1 Home page
- FR-1: Display a short manifesto/statement (owner-editable text).
- FR-2: Display a "highlight reel" of up to 3 featured projects (flagged via `featured = true`), each with a preview and link to its case study.
- FR-3: Provide primary navigation to Systems Lab, Ideas, CV, About.

### 3.2 Systems Lab (project showcase)
- FR-4: Display all published projects in a grid/bento layout, ordered by `display_order`.
- FR-5: Each project card shows title, one-line summary, tech stack tags, and a cover image or video thumbnail.
- FR-6: Clicking a card opens a full case-study page with: problem statement, solution description, tech stack, an embedded video walkthrough (if provided), and outcome/impact.
- FR-7: Video walkthroughs are embedded YouTube videos (unlisted), lazy-loaded so they don't autoplay or load the player until the visitor interacts.
- FR-8: Projects not marked `published` must never appear on any public route.

### 3.3 Ideas portal
- FR-9: Any visitor can submit an idea via a form: title, description, optional name (anonymous allowed).
- FR-10: Submission form is protected by Cloudflare Turnstile; submissions without a valid token are rejected server-side.
- FR-11: Submissions are rate-limited per IP (default: 5 per hour) to prevent flooding.
- FR-12: New submissions are **not** publicly visible until an admin approves them.
- FR-13: The public ideas feed shows only approved ideas, with title, description, submitter name (or "anonymous"), status, and vote count.
- FR-14: Visitors can upvote an idea once per session (deduped via a hashed session fingerprint, not requiring login).
- FR-15: Ideas display a status: submitted → under review → in the lab → shipped, or declined (declined ideas are not shown publicly).
- FR-16: The feed can be sorted by vote count or recency.

### 3.4 CV
- FR-17: Display an interactive timeline of experience/roles (owner-editable content).
- FR-18: Provide a "download PDF" button producing a static, up-to-date CV document.

### 3.5 About
- FR-19: Short bio page; content owner-editable.

### 3.6 Admin
- FR-20: A single admin account (no public registration anywhere in the app) can log in via a dedicated `/admin` route.
- FR-21: Admin can create, edit, publish/unpublish, feature/unfeature, and reorder projects.
- FR-22: Admin can view a moderation queue of pending ideas and approve, decline, or change their status.
- FR-23: All admin actions are rejected server-side for any unauthenticated request, regardless of client-side UI state.

## 4. Non-functional requirements

- NFR-1 (Performance): Core Web Vitals in the "good" range on mobile — case study and home pages must be statically generated or ISR-cached, not rendered fresh per request.
- NFR-2 (Cost): The system must run entirely within free tiers (Vercel Hobby, Supabase free project, YouTube, Cloudflare Turnstile) at expected traffic levels (a few thousand visits/month).
- NFR-3 (Accessibility): WCAG 2.2 AA contrast; all motion/animation respects `prefers-reduced-motion`; all interactive elements are keyboard-navigable.
- NFR-4 (Security): Public database access uses only the Supabase anon key constrained by row-level security; the service-role key is never exposed client-side. Admin routes verify session server-side.
- NFR-5 (Abuse resistance): No idea submission reaches the public feed without explicit admin approval; bot submissions are blocked by Turnstile before hitting the database.
- NFR-6 (Privacy): Idea submitter name is optional; no other personal data is collected or displayed on public routes. Vote deduplication uses a hashed, non-identifying session value.
- NFR-7 (Maintainability): All owner-editable content (manifesto text, project details, CV entries) is managed through the admin UI, not hardcoded in components, so Epy can update the site without redeploying code for content changes.

## 5. Out of scope (v1)

- Public user accounts / visitor login.
- Comments on ideas or projects (voting only).
- Multi-admin roles or permission tiers.
- Self-hosted video (explicitly rejected in favor of YouTube unlisted — see ARCHITECTURE.md §8).
- Payment/monetization features.

## 6. Acceptance criteria (high-level, per feature)

- A visitor can land on `/`, see the manifesto and up to 3 featured projects, and navigate to `/systems`.
- A visitor can open a case study, watch an embedded video, and see problem/solution/stack/outcome content.
- A visitor can submit an idea; it does **not** appear on `/ideas` until Epy approves it from `/admin/ideas`.
- A visitor cannot submit more than the rate limit within an hour, and cannot bypass Turnstile.
- A visitor can upvote an approved idea once; a second attempt in the same session does not double-count.
- Epy can log into `/admin`, create a new project, mark it published and featured, and see it appear on the home page and systems lab without a redeploy.
- An unauthenticated request to any `/api/admin/*` endpoint is rejected regardless of what the client sends.
- The CV page offers a working "download PDF" that reflects current CV content.
