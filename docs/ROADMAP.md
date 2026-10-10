# Roadmap — making dalitsomalama.dev worth staying on

_Researched and drafted 2026-10-10. Phase 1 is built; everything after it is a
proposal for Dalitso to approve, reorder or cut._

## What the research says

1. **Reviewers skim.** The typical pass is: home page → one featured project →
   GitHub → leave, often inside a minute. Whatever we add has to make that
   first minute stronger, not hide the work behind gimmicks.
   ([devplaybook](https://devplaybook.cc/blog/developer-portfolio-checklist-20-things-hiring-managers),
   [Scrimba](https://scrimba.com/articles/how-to-build-a-web-developer-portfolio-that-gets-you-hired))
2. **Real work beats volume.** Projects that solve a real problem, explained
   with the decisions behind them, outrank a dozen tutorial clones — and
   three to five deep case studies beat ten shallow ones.
   ([Substack](https://arslandg.substack.com/p/3-portfolio-projects-that-actually),
   [SimeonOnSecurity](https://simeononsecurity.com/software-development-career-playbook/getting-started-in-software-development/building-a-developer-portfolio/))
3. **Live demos are the most-requested missing piece.** Checklists repeatedly
   flag "no live demo" as a reason a portfolio gets passed over.
4. **Interactivity should serve the case studies.** Memorable sites (Bruno
   Simon's driveable portfolio, game-like guided tours) work because the
   interaction *is* the content.
   ([Elementor roundup](https://elementor.com/blog/best-web-developer-portfolio-examples/))

**The gap this site has:** Dalitso's strongest work runs on Nkana Water's
intranet. A visitor can read about it but can't touch it. Closing that gap —
safely, with synthetic data — is the single highest-value thing on this list.

---

## Phase 1 — Look and feel ✅ built

- Typography system: tight display headings with an italic serif accent
  (Instrument Serif), mono eyebrows, balanced line breaks.
- Signature hero: a live flow-field canvas (data streaming like water) that
  parts around the pointer and lights up in the accent colour.
- Reactive surfaces: pointer spotlight on the page grid and on every card,
  magnetic buttons, animated nav pill, scroll progress bar, page-enter
  transitions, count-up impact numbers, tool marquee.
- Home rebuilt as a narrative: hero → impact → selected work → how I work
  (with Hairline figures) → tools → ideas call-to-action → closing footer.
- Case studies rebuilt as editorial pages with numbered chapters and a
  "next case study" hand-off so readers keep going.
- Systems Lab gets an animated organisation filter.
- Everything respects light/dark, reduced motion and phone widths.

---

## Phase 2 — "Proof you can touch": live sandboxes ⭐ highest value

**Status (2026-10-10):** `/playground` is live with two simulations — the
meter discrepancy playground and the water-quality IoT monitor (which also
replaced the old air-quality project). QR clock-in and the mini GIS map are next.

A new **/playground** page plus an embedded demo inside each matching case study.
All run in the browser on **synthetic data**, so no Nkana Water data or
systems are exposed.

| Sandbox | What the visitor does | Why it lands | Effort |
|---|---|---|---|
| **Meter discrepancy playground** | Drag the "too high / too low" thresholds; 2,000 generated readings re-classify live, and the branch charts and flag counts update instantly. | It turns "I validate 33,000 readings a month" into something a reviewer can feel in ten seconds. | M |
| **QR clock-in, across devices** | A rotating QR code (new every 30s) shows on screen; scanning it with a phone makes the desktop page react: "Clocked in from a phone in Lusaka, 14:32". | The real wow moment — two devices talking. Needs Supabase Realtime. | M–L |
| **Mini GIS map** | A synthetic town of parcels coloured by consumption status; hover a parcel for a (fake) account card; filter by status. | Shows the GIS work without any customer data. MapLibre or plain SVG. | M |
| **Spreadsheet → dashboard** | Drop a CSV (processed only in the browser, never uploaded) and get instant charts and anomaly flags. | Directly useful to small-business visitors; doubles as lead generation for the Ideas portal. | L |

---

## Phase 3 — Deeper case studies

Per project, all optional fields editable from /admin:

- **Animated architecture diagram** — e.g. readings → rules engine → reports,
  drawing itself as you scroll.
- **"Decisions" section** — short, decision-record-style notes. The Blazor →
  Laravel migration of the revenue dashboard is a perfect first one: *why* it
  moved is exactly the judgment reviewers look for.
- **My role and team** — solo or co-developed (the audit system was a team
  effort; say so precisely).
- **Before / after slider** — the Excel sheet vs the dashboard (redacted).
- **Lessons learned** — one or two honest lines.
- **Dynamic share images** (`next/og`) so every case study looks good when
  posted on LinkedIn — important while job-hunting.

---

## Phase 4 — Reasons to come back

| Feature | What it is | Effort |
|---|---|---|
| **/now** | What Dalitso is building, learning and reading this month. Two minutes to update; gives repeat visitors something new. | S |
| **/notes (build log)** | Short MDX posts: "Validating 33k meter readings without Excel", "Why I rebuilt a Blazor app in Laravel". Good for search and for interviews. | M |
| **Ideas board view** | Show ideas as columns (Submitted → In the lab → Shipped) with a changelog when one ships, so voters see their idea move. | M |
| **/uses** | Hardware, editors and tools — a classic developer-site page people browse. | S |

---

## Phase 5 — Delight

- **Command palette (Ctrl/⌘ + K)** — jump to any page, case study or action
  ("copy email", "toggle theme", "download CV"). Developer audiences love it.
- ~~Custom air-quality figure~~ — superseded: the project became the
  water-quality monitor, which now has its own live simulation.
- **Custom 404** with the Hairline `Query` figure and links back.
- **Small easter egg** — e.g. typing `make` anywhere opens a terminal-style
  view of the site. Optional; keep it tasteful.

---

## Phase 6 — Convert and measure

- **Contact form** (Turnstile-protected, already used by the Ideas portal) in
  addition to copy-email.
- **Book a call** — a Cal.com embed for recruiters.
- **Privacy-friendly analytics** (Vercel Analytics or Plausible): which case
  studies get read to the end, where people leave. Without this we're
  guessing what to build next.
- **SEO basics**: sitemap, robots, per-page descriptions, structured data
  (Person + CreativeWork).

---

## Suggested order

1. Phase 2: meter discrepancy playground (the strongest single upgrade).
2. Phase 3: decisions + share images for the top 3 case studies.
3. Phase 5: command palette and 404 (quick, high polish).
4. Phase 2: QR clock-in cross-device demo (needs Supabase live).
5. Phase 4: /now and the first two notes.
6. Phase 6: analytics, then contact form and booking.

## Guardrails (from the privacy decisions already made)

- Sandboxes use generated data only; nothing from Nkana Water's systems.
- No kwacha figures, customer details or staff names — in demos, notes or
  share images.
- Every animation must have a reduced-motion fallback and must not slow the
  first paint; budget: home page LCP under 2.5s on a mid-range phone.
