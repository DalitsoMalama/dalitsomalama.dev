-- Site content and case studies for a freshly-created Supabase project.
-- Generated from lib/data/fixtures.ts — the same content `npm run dev` shows
-- without Supabase — so the live site starts identical to local dev. After
-- the first load, edit everything from /admin instead of re-running this.
--
-- `on conflict do nothing` makes this safe to re-run: it never overwrites
-- content you've since edited in /admin.

insert into site_content (key, value) values
  ('manifesto', '"Billing dashboards, GIS maps, automated reports, audit and attendance platforms — designed, built and running every day inside a working water utility in Zambia."'::jsonb),
  ('about', '"I''m Mwenya Dalitso Malama, a software and data engineer based in Kitwe, Zambia, with a BEng in Computer Engineering (with Credit) from the Copperbelt University.\n\nAt Nkana Water Supply and Sanitation Company I work as a Graduate Trainee in Software and Data Science. My job is to find the processes that still run on Excel, email and paper, and replace them with systems that the billing, customer service, HR and audit teams can rely on. Since August 2025 that has meant a revenue and billing dashboard, a GIS map of every customer account, automated meter-reading validation, an internal audit platform and a QR-code attendance system.\n\nBefore that I built embedded and application software at IKAL Solutions, and the CBU Challenge fundraising website at the Copperbelt University''s Directorate of ICT. At university, my group projects included an ESP32 water-quality monitor that watched a campus fish pond around the clock for a week.\n\nMy approach is simple: find the recurring problem, put it in front of the people who can fix it, and measure the result.\n\nI work across C#/.NET, PHP (Laravel), React and NestJS, SQL Server and PostgreSQL, with Power BI and Excel for analysis. If you have a manual process you''d like automated, send it through the Ideas page."'::jsonb),
  ('profile', '{"name":"Mwenya Dalitso Malama","headline":"Software / Data & Automation Expert","tagline":"I turn spreadsheets into *systems people rely on.*","availability":"Open to new roles & projects","location":"Kitwe, Zambia","email":"dalitsomalama518@gmail.com","phones":["+260 761 809 955","+260 970 203 074"],"whatsapp":"+260 761 809 955","linkedin_url":"https://www.linkedin.com/in/dalitso-malama-b73558239/","github_url":"https://github.com/DalitsoMalama","highlights":[{"value":"81,000+","label":"customer accounts on the GIS operations map"},{"value":"33,000+","label":"meter readings validated automatically every month"},{"value":"<50% → 80%+","label":"complaint resolution rate after the GIS map went live"}]}'::jsonb),
  ('cv_entries', '[{"role":"Graduate Trainee — Software and Data Science","organization":"Nkana Water Supply and Sanitation Company","start_date":"2025-08","end_date":null,"summary":"Building the dashboards, automated reports and internal systems that the billing, customer service, HR and audit teams use every day.","highlights":["Built the real-time revenue and billing dashboard branches use to trace unbilled accounts to their root cause — first in C# Blazor, then migrated to Laravel for a better UI/UX","Built a GIS operations map of 81,000+ customer accounts; complaint resolution rose from under 50% to over 80% after launch","Automated validation of 33,000+ meter readings a month across all branches, replacing a manual Excel reconciliation","Co-developed the company''s audit management system for audit plans, findings and queries","Built a web and mobile attendance system with rotating QR-code clock-in and automatic overtime calculation","Built Payroll Pro to replace the manual overtime approval chain between area managers, HR and payroll"]},{"role":"Software and Data Developer","organization":"IKAL Solutions, Kitwe","start_date":"2024-12","end_date":"2025-08","summary":"Embedded and application development: integrating sensor hardware with the software people actually use.","highlights":["Built an HR analytics dashboard in Power BI on SQL Server covering headcount, performance, attendance and turnover","Built C# .NET MAUI apps and Blazor web applications using domain-driven design and Entity Framework"]},{"role":"Software Developer Intern","organization":"Copperbelt University, Directorate of ICT","start_date":"2024-09","end_date":"2024-12","summary":"Built and launched the CBU Challenge fundraising website in PHP and MySQL, live at cbu.ac.zm/cbu-challenge.","highlights":["Took the site from build to public launch in two months","Applied object-oriented design and SOLID principles to keep it maintainable"]},{"role":"Software Developer Intern","organization":"IKAL Solutions, Kitwe","start_date":"2023-09","end_date":"2024-01","summary":"First real-world software role: building for real constraints, real users and long-term maintainability.","highlights":[]}]'::jsonb),
  ('skills', '[{"group":"Software development","items":["C# / .NET (APIs, Blazor, MAUI)","PHP / Laravel","React + Vite","TanStack Query","NestJS","Prisma ORM","React Native","Next.js"]},{"group":"Data & analytics","items":["SQL","Power BI","Power Query","Power Automate","Excel dashboards","Data cleaning & validation","Reconciliation","Anomaly detection"]},{"group":"Databases","items":["SQL Server","PostgreSQL","MySQL","Redis"]},{"group":"Deployment & infrastructure","items":["IIS","Active Directory (AD DS)","DHCP","DNS","Docker","Git"]},{"group":"Tools","items":["Visual Studio 2022","VS Code","SQL Server Management Studio","pgAdmin","Arduino IDE","Google Apps Script"]},{"group":"Other","items":["Agentic AI tooling","Project management","Graphic design","Robotics programming"]}]'::jsonb),
  ('education', '[{"qualification":"BEng Computer Engineering, with Credit","institution":"Copperbelt University","year":"2025","note":"ZAQA verified, Level 7"},{"qualification":"Grade 12 School Certificate","institution":"John Paul II Secondary School","year":null,"note":null}]'::jsonb),
  ('certifications', '[{"name":"Practising Licence","issuer":"ICTAZ","year":"2026"},{"name":"Software Engineer","issuer":"HackerRank","year":null},{"name":"SQL","issuer":"HackerRank","year":null},{"name":"CCNA 1: Introduction to Networks","issuer":"Cisco","year":null}]'::jsonb)
on conflict (key) do nothing;

insert into projects (slug, title, summary, problem, solution, outcome, organization, period, note, tech_stack, cover_image_url, gallery_images, figure, demo, featured, published, display_order) values
  (
    'revenue-billing-dashboard',
    'Revenue & Billing Dashboard',
    'Real-time billing and collections against target, so branches can trace unbilled accounts to their cause.',
    'Revenue and billing officers had no live view of how collections were tracking against monthly, daily and yearly targets. Progress was pieced together from exports and spreadsheets after the fact, and unbilled accounts were hard to trace back to a cause while there was still time to act.',
    'A real-time dashboard showing billing and collections against targets that management sets in the system — per branch and per area, with trends over time and drill-downs into unbilled and unpaid accounts.

I built the first version in C# Blazor (.NET 8) with MudBlazor and SQL Server. As it grew, I migrated it to PHP Laravel for a better UI/UX, and it now sits alongside the meter discrepancy reports in the company''s automated reporting platform.',
    'Branches use it to trace unbilled accounts to their root cause, and monthly billing has risen since the Laravel version launched in May 2026. Targets are set and tracked in the system instead of in spreadsheets.',
    'Nkana Water Supply and Sanitation Company',
    'Aug 2025 – 2026',
    'Runs on Nkana Water''s intranet, so there is no public link. Customer details, staff names and financial figures are blurred in these screenshots.',
    array['Laravel', 'PHP', 'SQL Server', 'C# Blazor (v1)', 'MudBlazor'],
    '/projects/revenue-billing-dashboard/operations-monitor.jpg',
    array['/projects/revenue-billing-dashboard/v1-blazor.jpg', '/projects/revenue-billing-dashboard/v1-targets.jpg'],
    null,
    null,
    true,
    true,
    1
  ),
  (
    'gis-operations-map',
    'GIS Operations Map',
    '81,000+ customer accounts on a live map, with billing, consumption, debt and complaints for every property.',
    'Customer data — billing, consumption, debt, complaints — lived in tables with no sense of where anything was. Patterns tied to location were invisible, and field staff had no quick way to find the properties that needed attention.',
    'A GIS map that places every customer property on the map and colours it by status: accepted, zero, too-low or too-high consumption, no reading, unpaid or unbilled. Clicking a property shows its account, meter, tariff, readings and balance.

Scheduled background jobs pull payments and complaints into PostgreSQL so the map stays current, and staff can filter by branch, DMA, amount band and category.',
    'Field teams and customer attendants now have a live view of open issues and respond to complaints faster. The complaint resolution rate rose from under 50% to over 80% after the map went live.',
    'Nkana Water Supply and Sanitation Company',
    'Aug 2026 – present',
    'Runs on Nkana Water''s intranet, so there is no public link. Customer details, staff names and financial figures are blurred in these screenshots.',
    array['Laravel', 'PostgreSQL', 'Leaflet', 'Hangfire', 'Queue jobs'],
    '/projects/gis-operations-map/revenue-view.jpg',
    array['/projects/gis-operations-map/branch-view.jpg'],
    null,
    null,
    true,
    true,
    2
  ),
  (
    'meter-discrepancy-reports',
    'Automated Meter Discrepancy Reports',
    'Validates 33,000+ meter readings a month and produces branch-level discrepancy reports with no Excel work.',
    'Every month, meter readings from all branches had to be checked by hand in Excel for abnormal consumption, missing readings and faulty meters before they reached billing. It was slow, inconsistent between branches, and errors slipped through.',
    'A Laravel system on SQL Server that runs every reading through configurable classification rules — negative, zero, too-low and too-high consumption, no reading, buried, flooded or faulty meters — then produces dashboards and exportable reports by category and branch, compared against the previous period.

Admins tune the classification rules from the UI, without code changes.',
    'Replaced the manual Excel reconciliation. 33,000+ readings are validated automatically each month, and every branch gets the same consistent discrepancy report.',
    'Nkana Water Supply and Sanitation Company',
    'Apr – Aug 2026',
    'Runs on Nkana Water''s intranet, so there is no public link.',
    array['Laravel', 'PHP', 'SQL Server'],
    '/projects/meter-discrepancy-reports/dashboard.jpg',
    '{}'::text[],
    null,
    'meter-discrepancy',
    true,
    true,
    3
  ),
  (
    'audit-management-system',
    'Audit Management System',
    'Digitises the internal audit cycle: annual plans, audits, findings, queries and approvals.',
    'Internal audits ran on documents and email. Annual plans, information requests, findings and follow-ups were tracked by hand, so audits took longer than they needed to and overdue items were easy to miss.',
    'A web platform covering the full audit cycle: annual audit plans approved by the audit committee, audits scheduled per quarter and department, special audit requests, information requests, findings and queries, and an archive.

React front end, NestJS API and PostgreSQL, with Redis and MinIO for caching and document storage. I co-developed it as part of the team.',
    'Plans, findings and queries live in one place with clear owners, and overdue entries are flagged automatically, so compliance risks surface earlier instead of at year end.',
    'Nkana Water Supply and Sanitation Company',
    'Feb 2026 – present',
    'Runs on Nkana Water''s intranet, so there is no public link. Customer details, staff names and financial figures are blurred in these screenshots.',
    array['React', 'NestJS', 'PostgreSQL', 'Redis', 'MinIO'],
    '/projects/audit-management-system/audit-plan.jpg',
    '{}'::text[],
    null,
    null,
    false,
    true,
    4
  ),
  (
    'attendance-management-system',
    'Attendance Management (Web + Mobile)',
    'Clock-in by scanning a QR code that changes every 30 seconds, with leave, payslips and automatic overtime.',
    'Attendance was easy to fake — staff could be registered as present by someone else — and overtime was calculated by hand, which made payroll slow and disputes common.',
    'A web admin portal and a mobile app. Staff clock in and out by scanning a dynamic QR code that rotates every 30 seconds, with fingerprint authentication on the device, so a code can''t be shared or reused.

The system records hours, handles leave requests and balances, issues payslips and calculates overtime automatically.',
    'Ended false attendance registration and removed manual overtime calculation.',
    'Nkana Water Supply and Sanitation Company',
    'Jun – Aug 2026',
    'Runs on Nkana Water''s intranet. Personal details are blurred in these screenshots.',
    array['React', 'NestJS', 'PostgreSQL', 'Mobile', 'QR codes'],
    '/projects/attendance-management-system/mobile-app.jpg',
    array['/projects/attendance-management-system/register-employee.jpg'],
    null,
    null,
    false,
    true,
    5
  ),
  (
    'payroll-pro',
    'Payroll Pro',
    'Replaces overtime worksheets passed between offices with one traceable approval workflow.',
    'Area managers sent overtime worksheets to HR. HR officers computed overtime and consolidated the amounts, sent them back to area managers to confirm, then on to the HR manager for sign-off and finally to payroll. Every hand-off was manual, slow and hard to audit.',
    'A React + NestJS system on PostgreSQL that handles salary and overtime for permanent and part-time staff in one place. Entries move through pending, approved and rejected states with a full audit trail, and reports — payroll summary, deductions, employee hours, audit trail — export to CSV, PDF or Excel.',
    'One workflow replaces the worksheet chain, so processing is faster and every change is traceable.',
    'Nkana Water Supply and Sanitation Company',
    'Oct – Nov 2025',
    'Screenshots use seeded demo data.',
    array['React', 'NestJS', 'PostgreSQL'],
    '/projects/payroll-pro/dashboard.jpg',
    array['/projects/payroll-pro/entries.jpg'],
    null,
    null,
    false,
    true,
    6
  ),
  (
    'hr-analytics-dashboard',
    'HR Analytics Dashboard',
    'Headcount, performance, attendance and turnover in one Power BI view on SQL Server.',
    'HR needed to see employee performance and capacity across departments as it changed, not in periodic spreadsheets.',
    'A Power BI report connected directly to SQL Server, with pages for overview KPIs, performance (salary vs performance, top performers), attendance and leave, and employee details — all filterable by department and gender.',
    'Headcount, performance, attendance and turnover in one view that refreshes straight from the database.',
    'IKAL Solutions',
    'Jul 2025',
    'Data-analysis project built on sample data.',
    array['Power BI', 'SQL Server', 'Power Query'],
    '/projects/hr-analytics-dashboard/overview.jpg',
    '{}'::text[],
    null,
    null,
    false,
    true,
    7
  ),
  (
    'cbu-challenge-website',
    'CBU Challenge Website',
    'Public fundraising site for the Copperbelt University''s infrastructure endowment, live at cbu.ac.zm.',
    'The CBU Challenge — a fundraiser for modernising the university''s infrastructure — needed a public home: somewhere to explain the campaign, show its patrons and team, and let donors pledge and get in touch.',
    'Built end to end during my internship at the Directorate of ICT: PHP for the back-end logic, MySQL for data and Bootstrap for the front end. Pages cover the vision, campaign, team, donors, donation details and a contact form that reaches the CBU team directly.',
    'Launched publicly at https://www.cbu.ac.zm/cbu-challenge.',
    'Copperbelt University, Directorate of ICT',
    'Oct – Nov 2024',
    null,
    array['PHP', 'MySQL', 'Bootstrap'],
    '/projects/cbu-challenge-website/home.jpg',
    '{}'::text[],
    null,
    null,
    false,
    true,
    8
  ),
  (
    'water-quality-monitor',
    'Water Quality IoT Monitor',
    'An ESP32 that samples pH, turbidity and ammonia in a fish pond and streams the readings live, with alerts when the water turns unsafe.',
    'Fish ponds can turn harmful quickly: ammonia from fish waste builds up, pH swings, and the water clouds. Checking by hand with test kits happens too rarely to catch a problem while there is still time to act.',
    'A third-year group project at the Copperbelt University. An ESP32 microcontroller reads three probes on a fixed interval — a pH sensor, a turbidity sensor and an ammonia sensor — converts their raw signals into pH, NTU and mg/L, and sends each reading over Wi-Fi to a live dashboard.

The dashboard shows the current values, their recent history, and raises an alert the moment a reading leaves its safe range.',
    'We deployed it in a fish pond at the Copperbelt University and monitored the water continuously for a week, with every reading streaming to the dashboard as it was taken.',
    'Copperbelt University',
    '2023 · Group project',
    'The animation above is a simulation with generated readings, built to show how the device and dashboard work together.',
    array['ESP32', 'Arduino (C++)', 'pH sensor', 'Turbidity sensor', 'Ammonia sensor', 'Wi-Fi'],
    null,
    '{}'::text[],
    null,
    'water-quality',
    false,
    true,
    9
  )
on conflict (slug) do nothing;
