// Dev-only sample content, used when NEXT_PUBLIC_SUPABASE_URL is unset so
// `npm run dev` renders realistic pages with zero external setup. Never used
// once Supabase is configured — see isSupabaseConfigured() call sites below.
// supabase/seed.sql carries the same site content for a real project; keep
// the two in sync when editing either.
import type {
  Certification,
  CvEntry,
  EducationEntry,
  Idea,
  Profile,
  Project,
  SkillGroup,
} from "@/lib/types";

const NWSC = "Nkana Water Supply and Sanitation Company";
const INTRANET_NOTE =
  "Runs on Nkana Water's intranet, so there is no public link. Customer details, staff names and financial figures are blurred in these screenshots.";

export const fixtureProjects: Project[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "revenue-billing-dashboard",
    title: "Revenue & Billing Dashboard",
    summary:
      "Real-time billing and collections against target, so branches can trace unbilled accounts to their cause.",
    problem:
      "Revenue and billing officers had no live view of how collections were tracking against monthly, daily and yearly targets. Progress was pieced together from exports and spreadsheets after the fact, and unbilled accounts were hard to trace back to a cause while there was still time to act.",
    solution:
      "A real-time dashboard showing billing and collections against targets that management sets in the system — per branch and per area, with trends over time and drill-downs into unbilled and unpaid accounts.\n\nI built the first version in C# Blazor (.NET 8) with MudBlazor and SQL Server. As it grew, I migrated it to PHP Laravel for a better UI/UX, and it now sits alongside the meter discrepancy reports in the company's automated reporting platform.",
    outcome:
      "Branches use it to trace unbilled accounts to their root cause, and monthly billing has risen since the Laravel version launched in May 2026. Targets are set and tracked in the system instead of in spreadsheets.",
    organization: NWSC,
    period: "Aug 2025 – 2026",
    note: INTRANET_NOTE,
    tech_stack: ["Laravel", "PHP", "SQL Server", "C# Blazor (v1)", "MudBlazor"],
    video_youtube_id: null,
    cover_image_url: "/projects/revenue-billing-dashboard/operations-monitor.jpg",
    gallery_images: [
      "/projects/revenue-billing-dashboard/v1-blazor.jpg",
      "/projects/revenue-billing-dashboard/v1-targets.jpg",
    ],
    figure: null,
    demo: null,
    featured: true,
    published: true,
    display_order: 1,
    created_at: "2025-08-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "gis-operations-map",
    title: "GIS Operations Map",
    summary:
      "81,000+ customer accounts on a live map, with billing, consumption, debt and complaints for every property.",
    problem:
      "Customer data — billing, consumption, debt, complaints — lived in tables with no sense of where anything was. Patterns tied to location were invisible, and field staff had no quick way to find the properties that needed attention.",
    solution:
      "A GIS map that places every customer property on the map and colours it by status: accepted, zero, too-low or too-high consumption, no reading, unpaid or unbilled. Clicking a property shows its account, meter, tariff, readings and balance.\n\nScheduled background jobs pull payments and complaints into PostgreSQL so the map stays current, and staff can filter by branch, DMA, amount band and category.",
    outcome:
      "Field teams and customer attendants now have a live view of open issues and respond to complaints faster. The complaint resolution rate rose from under 50% to over 80% after the map went live.",
    organization: NWSC,
    period: "Aug 2026 – present",
    note: INTRANET_NOTE,
    tech_stack: ["Laravel", "PostgreSQL", "Leaflet", "Hangfire", "Queue jobs"],
    video_youtube_id: null,
    cover_image_url: "/projects/gis-operations-map/revenue-view.jpg",
    gallery_images: ["/projects/gis-operations-map/branch-view.jpg"],
    figure: null,
    demo: null,
    featured: true,
    published: true,
    display_order: 2,
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-09-29T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "meter-discrepancy-reports",
    title: "Automated Meter Discrepancy Reports",
    summary:
      "Validates 33,000+ meter readings a month and produces branch-level discrepancy reports with no Excel work.",
    problem:
      "Every month, meter readings from all branches had to be checked by hand in Excel for abnormal consumption, missing readings and faulty meters before they reached billing. It was slow, inconsistent between branches, and errors slipped through.",
    solution:
      "A Laravel system on SQL Server that runs every reading through configurable classification rules — negative, zero, too-low and too-high consumption, no reading, buried, flooded or faulty meters — then produces dashboards and exportable reports by category and branch, compared against the previous period.\n\nAdmins tune the classification rules from the UI, without code changes.",
    outcome:
      "Replaced the manual Excel reconciliation. 33,000+ readings are validated automatically each month, and every branch gets the same consistent discrepancy report.",
    organization: NWSC,
    period: "Apr – Aug 2026",
    note: "Runs on Nkana Water's intranet, so there is no public link.",
    tech_stack: ["Laravel", "PHP", "SQL Server"],
    video_youtube_id: null,
    cover_image_url: "/projects/meter-discrepancy-reports/dashboard.jpg",
    gallery_images: [],
    figure: null,
    demo: "meter-discrepancy",
    featured: true,
    published: true,
    display_order: 3,
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-08-31T00:00:00Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    slug: "audit-management-system",
    title: "Audit Management System",
    summary:
      "Digitises the internal audit cycle: annual plans, audits, findings, queries and approvals.",
    problem:
      "Internal audits ran on documents and email. Annual plans, information requests, findings and follow-ups were tracked by hand, so audits took longer than they needed to and overdue items were easy to miss.",
    solution:
      "A web platform covering the full audit cycle: annual audit plans approved by the audit committee, audits scheduled per quarter and department, special audit requests, information requests, findings and queries, and an archive.\n\nReact front end, NestJS API and PostgreSQL, with Redis and MinIO for caching and document storage. I co-developed it as part of the team.",
    outcome:
      "Plans, findings and queries live in one place with clear owners, and overdue entries are flagged automatically, so compliance risks surface earlier instead of at year end.",
    organization: NWSC,
    period: "Feb 2026 – present",
    note: INTRANET_NOTE,
    tech_stack: ["React", "NestJS", "PostgreSQL", "Redis", "MinIO"],
    video_youtube_id: null,
    cover_image_url: "/projects/audit-management-system/audit-plan.jpg",
    gallery_images: [],
    figure: null,
    demo: null,
    featured: false,
    published: true,
    display_order: 4,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-08-31T00:00:00Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    slug: "attendance-management-system",
    title: "Attendance Management (Web + Mobile)",
    summary:
      "Clock-in by scanning a QR code that changes every 30 seconds, with leave, payslips and automatic overtime.",
    problem:
      "Attendance was easy to fake — staff could be registered as present by someone else — and overtime was calculated by hand, which made payroll slow and disputes common.",
    solution:
      "A web admin portal and a mobile app. Staff clock in and out by scanning a dynamic QR code that rotates every 30 seconds, with fingerprint authentication on the device, so a code can't be shared or reused.\n\nThe system records hours, handles leave requests and balances, issues payslips and calculates overtime automatically.",
    outcome:
      "Ended false attendance registration and removed manual overtime calculation.",
    organization: NWSC,
    period: "Jun – Aug 2026",
    note: "Runs on Nkana Water's intranet. Personal details are blurred in these screenshots.",
    tech_stack: ["React", "NestJS", "PostgreSQL", "Mobile", "QR codes"],
    video_youtube_id: null,
    cover_image_url: "/projects/attendance-management-system/mobile-app.jpg",
    gallery_images: ["/projects/attendance-management-system/register-employee.jpg"],
    figure: null,
    demo: null,
    featured: false,
    published: true,
    display_order: 5,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-08-31T00:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    slug: "payroll-pro",
    title: "Payroll Pro",
    summary:
      "Replaces overtime worksheets passed between offices with one traceable approval workflow.",
    problem:
      "Area managers sent overtime worksheets to HR. HR officers computed overtime and consolidated the amounts, sent them back to area managers to confirm, then on to the HR manager for sign-off and finally to payroll. Every hand-off was manual, slow and hard to audit.",
    solution:
      "A React + NestJS system on PostgreSQL that handles salary and overtime for permanent and part-time staff in one place. Entries move through pending, approved and rejected states with a full audit trail, and reports — payroll summary, deductions, employee hours, audit trail — export to CSV, PDF or Excel.",
    outcome:
      "One workflow replaces the worksheet chain, so processing is faster and every change is traceable.",
    organization: NWSC,
    period: "Oct – Nov 2025",
    note: "Screenshots use seeded demo data.",
    tech_stack: ["React", "NestJS", "PostgreSQL"],
    video_youtube_id: null,
    cover_image_url: "/projects/payroll-pro/dashboard.jpg",
    gallery_images: ["/projects/payroll-pro/entries.jpg"],
    figure: null,
    demo: null,
    featured: false,
    published: true,
    display_order: 6,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-11-30T00:00:00Z",
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    slug: "hr-analytics-dashboard",
    title: "HR Analytics Dashboard",
    summary: "Headcount, performance, attendance and turnover in one Power BI view on SQL Server.",
    problem:
      "HR needed to see employee performance and capacity across departments as it changed, not in periodic spreadsheets.",
    solution:
      "A Power BI report connected directly to SQL Server, with pages for overview KPIs, performance (salary vs performance, top performers), attendance and leave, and employee details — all filterable by department and gender.",
    outcome:
      "Headcount, performance, attendance and turnover in one view that refreshes straight from the database.",
    organization: "IKAL Solutions",
    period: "Jul 2025",
    note: "Data-analysis project built on sample data.",
    tech_stack: ["Power BI", "SQL Server", "Power Query"],
    video_youtube_id: null,
    cover_image_url: "/projects/hr-analytics-dashboard/overview.jpg",
    gallery_images: [],
    figure: null,
    demo: null,
    featured: false,
    published: true,
    display_order: 7,
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-31T00:00:00Z",
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    slug: "cbu-challenge-website",
    title: "CBU Challenge Website",
    summary:
      "Public fundraising site for the Copperbelt University's infrastructure endowment, live at cbu.ac.zm.",
    problem:
      "The CBU Challenge — a fundraiser for modernising the university's infrastructure — needed a public home: somewhere to explain the campaign, show its patrons and team, and let donors pledge and get in touch.",
    solution:
      "Built end to end during my internship at the Directorate of ICT: PHP for the back-end logic, MySQL for data and Bootstrap for the front end. Pages cover the vision, campaign, team, donors, donation details and a contact form that reaches the CBU team directly.",
    outcome: "Launched publicly at https://www.cbu.ac.zm/cbu-challenge.",
    organization: "Copperbelt University, Directorate of ICT",
    period: "Oct – Nov 2024",
    note: null,
    tech_stack: ["PHP", "MySQL", "Bootstrap"],
    video_youtube_id: null,
    cover_image_url: "/projects/cbu-challenge-website/home.jpg",
    gallery_images: [],
    figure: null,
    demo: null,
    featured: false,
    published: true,
    display_order: 8,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-11-30T00:00:00Z",
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    slug: "water-quality-monitor",
    title: "Water Quality IoT Monitor",
    summary:
      "An ESP32 that samples pH, turbidity and ammonia in a fish pond and streams the readings live, with alerts when the water turns unsafe.",
    problem:
      "Fish ponds can turn harmful quickly: ammonia from fish waste builds up, pH swings, and the water clouds. Checking by hand with test kits happens too rarely to catch a problem while there is still time to act.",
    solution:
      "A third-year group project at the Copperbelt University. An ESP32 microcontroller reads three probes on a fixed interval — a pH sensor, a turbidity sensor and an ammonia sensor — converts their raw signals into pH, NTU and mg/L, and sends each reading over Wi-Fi to a live dashboard.\n\nThe dashboard shows the current values, their recent history, and raises an alert the moment a reading leaves its safe range.",
    outcome:
      "We deployed it in a fish pond at the Copperbelt University and monitored the water continuously for a week, with every reading streaming to the dashboard as it was taken.",
    organization: "Copperbelt University",
    period: "2023 · Group project",
    note: "The animation above is a simulation with generated readings, built to show how the device and dashboard work together.",
    tech_stack: ["ESP32", "Arduino (C++)", "pH sensor", "Turbidity sensor", "Ammonia sensor", "Wi-Fi"],
    video_youtube_id: null,
    cover_image_url: null,
    gallery_images: [],
    figure: null,
    demo: "water-quality",
    featured: false,
    published: true,
    display_order: 9,
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2023-12-31T00:00:00Z",
  },
];

export const fixtureIdeas: Idea[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Email each branch its monthly report automatically",
    description:
      "Branch managers still wait for someone to export, filter and email their numbers. Generate each branch's report on the 1st and send it to them directly.",
    submitter_name: "Anonymous",
    status: "in_the_lab",
    vote_count: 14,
    approved: true,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "Check my water bill balance over WhatsApp",
    description:
      "Send an account number, get back the current balance and last payment — no need to visit an office or call.",
    submitter_name: null,
    status: "under_review",
    vote_count: 9,
    approved: true,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    title: "Turn a shop's stock spreadsheet into a dashboard",
    description:
      "Small shops track stock in Excel. A simple dashboard that flags low stock and best sellers each week would save hours.",
    submitter_name: null,
    status: "submitted",
    vote_count: 5,
    approved: true,
    created_at: "2026-09-20T00:00:00Z",
  },
];

export const fixtureManifesto =
  "Billing dashboards, GIS maps, automated reports, audit and attendance platforms — designed, built and running every day inside a working water utility in Zambia.";

export const fixtureAbout = `I'm Mwenya Dalitso Malama, a software and data engineer based in Kitwe, Zambia, with a BEng in Computer Engineering (with Credit) from the Copperbelt University.

At Nkana Water Supply and Sanitation Company I work as a Graduate Trainee in Software and Data Science. My job is to find the processes that still run on Excel, email and paper, and replace them with systems that the billing, customer service, HR and audit teams can rely on. Since August 2025 that has meant a revenue and billing dashboard, a GIS map of every customer account, automated meter-reading validation, an internal audit platform and a QR-code attendance system.

Before that I built embedded and application software at IKAL Solutions, and the CBU Challenge fundraising website at the Copperbelt University's Directorate of ICT. At university, my group projects included an ESP32 water-quality monitor that watched a campus fish pond around the clock for a week.

My approach is simple: find the recurring problem, put it in front of the people who can fix it, and measure the result.

I work across C#/.NET, PHP (Laravel), React and NestJS, SQL Server and PostgreSQL, with Power BI and Excel for analysis. If you have a manual process you'd like automated, send it through the Ideas page.`;

export const fixtureProfile: Profile = {
  name: "Mwenya Dalitso Malama",
  headline: "Software / Data & Automation Expert",
  tagline: "I turn spreadsheets into *systems people rely on.*",
  availability: "Open to new roles & projects",
  location: "Kitwe, Zambia",
  email: "dalitsomalama518@gmail.com",
  phones: ["+260 761 809 955", "+260 970 203 074"],
  whatsapp: "+260 761 809 955",
  linkedin_url: "https://www.linkedin.com/in/dalitso-malama-b73558239/",
  github_url: "https://github.com/DalitsoMalama",
  highlights: [
    { value: "81,000+", label: "customer accounts on the GIS operations map" },
    { value: "33,000+", label: "meter readings validated automatically every month" },
    { value: "<50% → 80%+", label: "complaint resolution rate after the GIS map went live" },
  ],
};

export const fixtureCvEntries: CvEntry[] = [
  {
    role: "Graduate Trainee — Software and Data Science",
    organization: NWSC,
    start_date: "2025-08",
    end_date: null,
    summary:
      "Building the dashboards, automated reports and internal systems that the billing, customer service, HR and audit teams use every day.",
    highlights: [
      "Built the real-time revenue and billing dashboard branches use to trace unbilled accounts to their root cause — first in C# Blazor, then migrated to Laravel for a better UI/UX",
      "Built a GIS operations map of 81,000+ customer accounts; complaint resolution rose from under 50% to over 80% after launch",
      "Automated validation of 33,000+ meter readings a month across all branches, replacing a manual Excel reconciliation",
      "Co-developed the company's audit management system for audit plans, findings and queries",
      "Built a web and mobile attendance system with rotating QR-code clock-in and automatic overtime calculation",
      "Built Payroll Pro to replace the manual overtime approval chain between area managers, HR and payroll",
    ],
  },
  {
    role: "Software and Data Developer",
    organization: "IKAL Solutions, Kitwe",
    start_date: "2024-12",
    end_date: "2025-08",
    summary:
      "Embedded and application development: integrating sensor hardware with the software people actually use.",
    highlights: [
      "Built an HR analytics dashboard in Power BI on SQL Server covering headcount, performance, attendance and turnover",
      "Built C# .NET MAUI apps and Blazor web applications using domain-driven design and Entity Framework",
    ],
  },
  {
    role: "Software Developer Intern",
    organization: "Copperbelt University, Directorate of ICT",
    start_date: "2024-09",
    end_date: "2024-12",
    summary:
      "Built and launched the CBU Challenge fundraising website in PHP and MySQL, live at cbu.ac.zm/cbu-challenge.",
    highlights: [
      "Took the site from build to public launch in two months",
      "Applied object-oriented design and SOLID principles to keep it maintainable",
    ],
  },
  {
    role: "Software Developer Intern",
    organization: "IKAL Solutions, Kitwe",
    start_date: "2023-09",
    end_date: "2024-01",
    summary:
      "First real-world software role: building for real constraints, real users and long-term maintainability.",
    highlights: [],
  },
];

export const fixtureSkills: SkillGroup[] = [
  {
    group: "Software development",
    items: [
      "C# / .NET (APIs, Blazor, MAUI)",
      "PHP / Laravel",
      "React + Vite",
      "TanStack Query",
      "NestJS",
      "Prisma ORM",
      "React Native",
      "Next.js",
    ],
  },
  {
    group: "Data & analytics",
    items: [
      "SQL",
      "Power BI",
      "Power Query",
      "Power Automate",
      "Excel dashboards",
      "Data cleaning & validation",
      "Reconciliation",
      "Anomaly detection",
    ],
  },
  {
    group: "Databases",
    items: ["SQL Server", "PostgreSQL", "MySQL", "Redis"],
  },
  {
    group: "Deployment & infrastructure",
    items: ["IIS", "Active Directory (AD DS)", "DHCP", "DNS", "Docker", "Git"],
  },
  {
    group: "Tools",
    items: [
      "Visual Studio 2022",
      "VS Code",
      "SQL Server Management Studio",
      "pgAdmin",
      "Arduino IDE",
      "Google Apps Script",
    ],
  },
  {
    group: "Other",
    items: ["Agentic AI tooling", "Project management", "Graphic design", "Robotics programming"],
  },
];

export const fixtureEducation: EducationEntry[] = [
  {
    qualification: "BEng Computer Engineering, with Credit",
    institution: "Copperbelt University",
    year: "2025",
    note: "ZAQA verified, Level 7",
  },
  {
    qualification: "Grade 12 School Certificate",
    institution: "John Paul II Secondary School",
    year: null,
    note: null,
  },
];

export const fixtureCertifications: Certification[] = [
  { name: "Practising Licence", issuer: "ICTAZ", year: "2026" },
  { name: "Software Engineer", issuer: "HackerRank", year: null },
  { name: "SQL", issuer: "HackerRank", year: null },
  { name: "CCNA 1: Introduction to Networks", issuer: "Cisco", year: null },
];
