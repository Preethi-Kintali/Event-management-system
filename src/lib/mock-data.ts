// Mock data used across the UI. No backend — everything here is static.

export type Status =
  | "active"
  | "draft"
  | "published"
  | "closed"
  | "pending"
  | "approved"
  | "rejected"
  | "archived"
  | "suspended"
  | "in_review";

export const organizations = [
  { id: "org_1", name: "Northwind Institute of Technology", type: "University", plan: "Enterprise", members: 4820, events: 64, status: "active" as Status, region: "APAC", created: "2023-04-12" },
  { id: "org_2", name: "Contoso Innovation Labs", type: "Corporate", plan: "Growth", members: 1240, events: 28, status: "active" as Status, region: "EMEA", created: "2024-01-09" },
  { id: "org_3", name: "Fabrikam Foundation", type: "Non-profit", plan: "Starter", members: 310, events: 9, status: "pending" as Status, region: "NA", created: "2025-02-21" },
  { id: "org_4", name: "Adventure Works Academy", type: "University", plan: "Growth", members: 2610, events: 41, status: "active" as Status, region: "NA", created: "2022-11-03" },
  { id: "org_5", name: "Tailspin Aerospace", type: "Corporate", plan: "Enterprise", members: 8730, events: 112, status: "active" as Status, region: "EMEA", created: "2021-08-17" },
  { id: "org_6", name: "Litware Skills Council", type: "Government", plan: "Enterprise", members: 15320, events: 203, status: "suspended" as Status, region: "APAC", created: "2020-06-30" },
  { id: "org_7", name: "Proseware Design Guild", type: "Community", plan: "Starter", members: 190, events: 6, status: "archived" as Status, region: "LATAM", created: "2025-05-14" },
  { id: "org_8", name: "Wide World Ventures", type: "Corporate", plan: "Growth", members: 940, events: 22, status: "active" as Status, region: "APAC", created: "2024-09-02" },
];

export const users = [
  { id: "usr_1", name: "Ananya Iyer", email: "ananya.iyer@northwind.edu", role: "Platform Admin", org: "Northwind Institute of Technology", status: "active" as Status, lastActive: "2 minutes ago", mfa: true },
  { id: "usr_2", name: "Marcus Feld", email: "m.feld@contoso.com", role: "Event Manager", org: "Contoso Innovation Labs", status: "active" as Status, lastActive: "18 minutes ago", mfa: true },
  { id: "usr_3", name: "Sofia Rossi", email: "sofia@fabrikam.org", role: "Judge", org: "Fabrikam Foundation", status: "pending" as Status, lastActive: "3 hours ago", mfa: false },
  { id: "usr_4", name: "Daniel Okafor", email: "d.okafor@tailspin.io", role: "Organization Admin", org: "Tailspin Aerospace", status: "active" as Status, lastActive: "Yesterday", mfa: true },
  { id: "usr_5", name: "Wei Chen", email: "wei.chen@adventureworks.edu", role: "Mentor", org: "Adventure Works Academy", status: "active" as Status, lastActive: "4 days ago", mfa: false },
  { id: "usr_6", name: "Priya Nair", email: "priya.nair@litware.gov", role: "Reviewer", org: "Litware Skills Council", status: "suspended" as Status, lastActive: "3 weeks ago", mfa: true },
  { id: "usr_7", name: "Tomás Duarte", email: "tomas@proseware.co", role: "Volunteer", org: "Proseware Design Guild", status: "active" as Status, lastActive: "1 hour ago", mfa: false },
  { id: "usr_8", name: "Hannah Berg", email: "hannah.berg@wideworld.com", role: "Recruiter", org: "Wide World Ventures", status: "active" as Status, lastActive: "35 minutes ago", mfa: true },
];

export const roles = [
  { id: "role_1", name: "Platform Admin", scope: "Global", users: 12, permissions: 48, description: "Full control across every organization and module.", status: "active" as Status },
  { id: "role_2", name: "Organization Admin", scope: "Organization", users: 86, permissions: 34, description: "Manages members, events and billing for a single org.", status: "active" as Status },
  { id: "role_3", name: "Event Manager", scope: "Event", users: 214, permissions: 22, description: "Creates and operates events, schedules and registrations.", status: "active" as Status },
  { id: "role_4", name: "Judge", scope: "Competition", users: 638, permissions: 9, description: "Evaluates assigned submissions with scorecards.", status: "active" as Status },
  { id: "role_5", name: "Mentor", scope: "Competition", users: 402, permissions: 7, description: "Guides teams during hackathons and challenges.", status: "active" as Status },
  { id: "role_6", name: "Recruiter", scope: "Organization", users: 128, permissions: 11, description: "Accesses talent pools and shortlists candidates.", status: "draft" as Status },
];

export const subscriptions = [
  { id: "sub_1", org: "Northwind Institute of Technology", plan: "Enterprise", seats: 5000, used: 4820, mrr: "$12,400", renewal: "2026-04-12", status: "active" as Status },
  { id: "sub_2", org: "Contoso Innovation Labs", plan: "Growth", seats: 1500, used: 1240, mrr: "$3,200", renewal: "2026-01-09", status: "active" as Status },
  { id: "sub_3", org: "Fabrikam Foundation", plan: "Starter", seats: 500, used: 310, mrr: "$490", renewal: "2026-02-21", status: "pending" as Status },
  { id: "sub_4", org: "Tailspin Aerospace", plan: "Enterprise", seats: 10000, used: 8730, mrr: "$21,900", renewal: "2026-08-17", status: "active" as Status },
  { id: "sub_5", org: "Litware Skills Council", plan: "Enterprise", seats: 20000, used: 15320, mrr: "$34,600", renewal: "2026-06-30", status: "suspended" as Status },
];

export const auditLogs = [
  { id: "log_1", actor: "Ananya Iyer", action: "role.permission.updated", target: "Event Manager", ip: "10.24.8.11", severity: "warning", timestamp: "2026-08-07 06:14 UTC" },
  { id: "log_2", actor: "System", action: "subscription.renewed", target: "Tailspin Aerospace", ip: "—", severity: "info", timestamp: "2026-08-07 05:02 UTC" },
  { id: "log_3", actor: "Marcus Feld", action: "event.published", target: "Contoso Global AI Sprint", ip: "88.14.201.7", severity: "info", timestamp: "2026-08-06 22:47 UTC" },
  { id: "log_4", actor: "Daniel Okafor", action: "user.suspended", target: "priya.nair@litware.gov", ip: "196.11.4.90", severity: "critical", timestamp: "2026-08-06 19:31 UTC" },
  { id: "log_5", actor: "Sofia Rossi", action: "submission.scored", target: "SUB-2291", ip: "51.9.77.4", severity: "info", timestamp: "2026-08-06 17:05 UTC" },
  { id: "log_6", actor: "System", action: "certificate.batch.generated", target: "1,204 certificates", ip: "—", severity: "info", timestamp: "2026-08-06 12:00 UTC" },
];

export const events = [
  { id: "evt_1", name: "Global AI Innovation Summit 2026", org: "Contoso Innovation Labs", mode: "Hybrid", location: "Berlin + Online", start: "2026-09-14", end: "2026-09-17", registrations: 4820, capacity: 6000, status: "published" as Status, category: "Summit" },
  { id: "evt_2", name: "Northwind Hack the Campus", org: "Northwind Institute of Technology", mode: "Onsite", location: "Bengaluru", start: "2026-08-22", end: "2026-08-24", registrations: 1940, capacity: 2000, status: "published" as Status, category: "Hackathon" },
  { id: "evt_3", name: "Tailspin Aerospace Design Challenge", org: "Tailspin Aerospace", mode: "Online", location: "Global", start: "2026-10-01", end: "2026-11-15", registrations: 812, capacity: 1500, status: "draft" as Status, category: "Challenge" },
  { id: "evt_4", name: "Fabrikam Social Impact Fellowship", org: "Fabrikam Foundation", mode: "Hybrid", location: "Nairobi + Online", start: "2026-07-02", end: "2026-07-28", registrations: 611, capacity: 700, status: "closed" as Status, category: "Fellowship" },
  { id: "evt_5", name: "Adventure Works Case Study Cup", org: "Adventure Works Academy", mode: "Online", location: "Global", start: "2026-09-05", end: "2026-09-12", registrations: 2260, capacity: 3000, status: "published" as Status, category: "Case Study" },
  { id: "evt_6", name: "Litware National Skills Olympiad", org: "Litware Skills Council", mode: "Onsite", location: "Singapore", start: "2026-12-03", end: "2026-12-09", registrations: 140, capacity: 5000, status: "draft" as Status, category: "Olympiad" },
  { id: "evt_7", name: "Wide World Founders Pitch Night", org: "Wide World Ventures", mode: "Onsite", location: "Sydney", start: "2026-08-19", end: "2026-08-19", registrations: 320, capacity: 350, status: "published" as Status, category: "Pitch" },
  { id: "evt_8", name: "Proseware Product Design Jam", org: "Proseware Design Guild", mode: "Online", location: "Global", start: "2026-06-11", end: "2026-06-13", registrations: 188, capacity: 400, status: "archived" as Status, category: "Jam" },
];

export const competitions = [
  { id: "cmp_1", name: "AI for Accessibility Track", event: "Global AI Innovation Summit 2026", type: "Hackathon", teams: 214, submissions: 186, prize: "$50,000", deadline: "2026-09-16", status: "active" as Status, rounds: 3 },
  { id: "cmp_2", name: "Campus Robotics Sprint", event: "Northwind Hack the Campus", type: "Hardware", teams: 96, submissions: 78, prize: "₹8,00,000", deadline: "2026-08-24", status: "active" as Status, rounds: 2 },
  { id: "cmp_3", name: "Sustainable Airframe Concept", event: "Tailspin Aerospace Design Challenge", type: "Design", teams: 41, submissions: 12, prize: "$120,000", deadline: "2026-11-10", status: "draft" as Status, rounds: 4 },
  { id: "cmp_4", name: "Impact Business Model Case", event: "Adventure Works Case Study Cup", type: "Case Study", teams: 302, submissions: 288, prize: "$15,000", deadline: "2026-09-11", status: "in_review" as Status, rounds: 2 },
  { id: "cmp_5", name: "Fintech Growth Simulation", event: "Wide World Founders Pitch Night", type: "Simulation", teams: 58, submissions: 58, prize: "AU$40,000", deadline: "2026-08-18", status: "closed" as Status, rounds: 1 },
];

export const registrations = [
  { id: "reg_1", participant: "Rhea Kapoor", email: "rhea.k@northwind.edu", event: "Northwind Hack the Campus", type: "Team", amount: "$0", paid: "Free", submitted: "2026-08-02", status: "approved" as Status },
  { id: "reg_2", participant: "Lukas Weber", email: "lukas.weber@contoso.com", event: "Global AI Innovation Summit 2026", type: "Individual", amount: "$249", paid: "Paid", submitted: "2026-08-01", status: "approved" as Status },
  { id: "reg_3", participant: "Amara Diallo", email: "amara.d@fabrikam.org", event: "Fabrikam Social Impact Fellowship", type: "Individual", amount: "$0", paid: "Waived", submitted: "2026-06-18", status: "closed" as Status },
  { id: "reg_4", participant: "Jonas Lind", email: "jonas.lind@tailspin.io", event: "Tailspin Aerospace Design Challenge", type: "Team", amount: "$99", paid: "Pending", submitted: "2026-08-06", status: "pending" as Status },
  { id: "reg_5", participant: "Meera Subramanian", email: "meera.s@adventureworks.edu", event: "Adventure Works Case Study Cup", type: "Team", amount: "$49", paid: "Paid", submitted: "2026-08-04", status: "approved" as Status },
  { id: "reg_6", participant: "Ben Carter", email: "ben.carter@wideworld.com", event: "Wide World Founders Pitch Night", type: "Individual", amount: "$0", paid: "Free", submitted: "2026-08-05", status: "rejected" as Status },
  { id: "reg_7", participant: "Yuki Tanaka", email: "yuki.tanaka@litware.gov", event: "Litware National Skills Olympiad", type: "Individual", amount: "$0", paid: "Free", submitted: "2026-08-07", status: "pending" as Status },
];

export const teams = [
  { id: "team_1", name: "Neural Nomads", competition: "AI for Accessibility Track", members: 4, lead: "Rhea Kapoor", progress: 82, submissions: 3, status: "active" as Status, created: "2026-07-20" },
  { id: "team_2", name: "Circuit Breakers", competition: "Campus Robotics Sprint", members: 5, lead: "Aditya Rao", progress: 64, submissions: 2, status: "active" as Status, created: "2026-07-28" },
  { id: "team_3", name: "Airfoil Collective", competition: "Sustainable Airframe Concept", members: 3, lead: "Jonas Lind", progress: 18, submissions: 0, status: "draft" as Status, created: "2026-08-03" },
  { id: "team_4", name: "Case Cartel", competition: "Impact Business Model Case", members: 4, lead: "Meera Subramanian", progress: 100, submissions: 1, status: "closed" as Status, created: "2026-06-30" },
  { id: "team_5", name: "Ledger Ninjas", competition: "Fintech Growth Simulation", members: 2, lead: "Ben Carter", progress: 100, submissions: 1, status: "approved" as Status, created: "2026-07-11" },
  { id: "team_6", name: "Quantum Quokkas", competition: "AI for Accessibility Track", members: 5, lead: "Hannah Berg", progress: 47, submissions: 1, status: "active" as Status, created: "2026-08-01" },
];

export const submissions = [
  { id: "SUB-2291", title: "SignBridge — realtime sign language captions", team: "Neural Nomads", competition: "AI for Accessibility Track", round: "Round 2", score: 87.5, reviewers: 3, submitted: "2026-08-05 14:22", status: "in_review" as Status },
  { id: "SUB-2288", title: "GripSense adaptive prosthetic controller", team: "Circuit Breakers", competition: "Campus Robotics Sprint", round: "Round 1", score: 91.2, reviewers: 4, submitted: "2026-08-04 09:10", status: "approved" as Status },
  { id: "SUB-2276", title: "Circular cabin interior concept", team: "Airfoil Collective", competition: "Sustainable Airframe Concept", round: "Draft", score: 0, reviewers: 0, submitted: "—", status: "draft" as Status },
  { id: "SUB-2260", title: "Micro-lending viability model for rural SMEs", team: "Case Cartel", competition: "Impact Business Model Case", round: "Final", score: 78.9, reviewers: 3, submitted: "2026-07-29 18:44", status: "approved" as Status },
  { id: "SUB-2244", title: "Fraud-resistant onboarding funnel", team: "Ledger Ninjas", competition: "Fintech Growth Simulation", round: "Final", score: 64.3, reviewers: 2, submitted: "2026-07-18 11:03", status: "rejected" as Status },
  { id: "SUB-2301", title: "VoiceNav indoor wayfinding for low vision", team: "Quantum Quokkas", competition: "AI for Accessibility Track", round: "Round 1", score: 0, reviewers: 1, submitted: "2026-08-06 23:58", status: "pending" as Status },
];

export const judges = [
  { id: "jdg_1", name: "Dr. Elena Marković", org: "Contoso Innovation Labs", expertise: "Machine Learning", assigned: 24, completed: 19, avgScore: 76.4, status: "active" as Status },
  { id: "jdg_2", name: "Prof. Rajat Menon", org: "Northwind Institute of Technology", expertise: "Robotics", assigned: 18, completed: 18, avgScore: 82.1, status: "approved" as Status },
  { id: "jdg_3", name: "Sofia Rossi", org: "Fabrikam Foundation", expertise: "Social Impact", assigned: 15, completed: 6, avgScore: 71.8, status: "pending" as Status },
  { id: "jdg_4", name: "Kenji Watanabe", org: "Tailspin Aerospace", expertise: "Aerodynamics", assigned: 12, completed: 3, avgScore: 68.2, status: "active" as Status },
  { id: "jdg_5", name: "Grace Mensah", org: "Wide World Ventures", expertise: "Venture Finance", assigned: 20, completed: 20, avgScore: 74.9, status: "approved" as Status },
];

export const mentors = [
  { id: "mnt_1", name: "Arjun Deshpande", expertise: "Product Strategy", teams: 6, hours: 42, rating: 4.9, org: "Contoso Innovation Labs", status: "active" as Status },
  { id: "mnt_2", name: "Lena Fischer", expertise: "Cloud Architecture", teams: 4, hours: 31, rating: 4.7, org: "Tailspin Aerospace", status: "active" as Status },
  { id: "mnt_3", name: "Wei Chen", expertise: "Data Science", teams: 8, hours: 55, rating: 4.8, org: "Adventure Works Academy", status: "approved" as Status },
  { id: "mnt_4", name: "Nadia Haddad", expertise: "UX Research", teams: 3, hours: 18, rating: 4.5, org: "Proseware Design Guild", status: "pending" as Status },
];

export const volunteers = [
  { id: "vol_1", name: "Tomás Duarte", role: "Registration Desk", shifts: 5, hours: 20, event: "Northwind Hack the Campus", status: "active" as Status },
  { id: "vol_2", name: "Ishita Bose", role: "Logistics", shifts: 7, hours: 28, event: "Global AI Innovation Summit 2026", status: "approved" as Status },
  { id: "vol_3", name: "Omar Farouk", role: "Tech Support", shifts: 3, hours: 12, event: "Litware National Skills Olympiad", status: "pending" as Status },
  { id: "vol_4", name: "Clara Nunes", role: "Hospitality", shifts: 4, hours: 16, event: "Wide World Founders Pitch Night", status: "active" as Status },
];

export const sponsors = [
  { id: "spn_1", name: "Contoso Cloud", tier: "Platinum", value: "$250,000", events: 6, contact: "partners@contoso.com", status: "active" as Status },
  { id: "spn_2", name: "Fabrikam Ventures", tier: "Gold", value: "$120,000", events: 4, contact: "sponsorship@fabrikam.org", status: "active" as Status },
  { id: "spn_3", name: "Tailspin Labs", tier: "Silver", value: "$60,000", events: 3, contact: "labs@tailspin.io", status: "pending" as Status },
  { id: "spn_4", name: "Wide World Capital", tier: "Gold", value: "$95,000", events: 2, contact: "capital@wideworld.com", status: "approved" as Status },
];

export const recruitment = [
  { id: "rct_1", candidate: "Rhea Kapoor", role: "ML Engineer Intern", company: "Contoso Innovation Labs", stage: "Interview", score: 92, source: "Hack the Campus", status: "active" as Status },
  { id: "rct_2", candidate: "Aditya Rao", role: "Robotics Trainee", company: "Tailspin Aerospace", stage: "Shortlisted", score: 88, source: "Campus Robotics Sprint", status: "pending" as Status },
  { id: "rct_3", candidate: "Meera Subramanian", role: "Strategy Analyst", company: "Wide World Ventures", stage: "Offer", score: 85, source: "Case Study Cup", status: "approved" as Status },
  { id: "rct_4", candidate: "Ben Carter", role: "Growth Associate", company: "Wide World Ventures", stage: "Rejected", score: 61, source: "Founders Pitch Night", status: "rejected" as Status },
];

export const certificates = [
  { id: "cert_1", recipient: "Rhea Kapoor", template: "Winner — Hackathon", event: "Northwind Hack the Campus", issued: "2026-08-25", serial: "NW-2026-00181", status: "approved" as Status },
  { id: "cert_2", recipient: "Lukas Weber", template: "Participation", event: "Global AI Innovation Summit 2026", issued: "2026-09-18", serial: "GA-2026-04412", status: "pending" as Status },
  { id: "cert_3", recipient: "Meera Subramanian", template: "Finalist", event: "Adventure Works Case Study Cup", issued: "2026-09-13", serial: "AW-2026-00932", status: "approved" as Status },
  { id: "cert_4", recipient: "Amara Diallo", template: "Fellowship Completion", event: "Fabrikam Social Impact Fellowship", issued: "2026-07-30", serial: "FB-2026-00047", status: "approved" as Status },
  { id: "cert_5", recipient: "Jonas Lind", template: "Participation", event: "Tailspin Aerospace Design Challenge", issued: "—", serial: "TS-2026-DRAFT", status: "draft" as Status },
];

export const notifications = [
  { id: "ntf_1", title: "12 submissions awaiting your evaluation", body: "AI for Accessibility Track — Round 2 closes in 2 days.", time: "6 min ago", type: "warning", unread: true },
  { id: "ntf_2", title: "Contoso Global AI Sprint published", body: "Marcus Feld published the event to 4,820 registrants.", time: "1 hour ago", type: "success", unread: true },
  { id: "ntf_3", title: "Payment failed for Fabrikam Foundation", body: "Starter plan renewal declined. Retry scheduled.", time: "3 hours ago", type: "error", unread: true },
  { id: "ntf_4", title: "1,204 certificates generated", body: "Batch NW-2026 completed successfully.", time: "Yesterday", type: "info", unread: false },
  { id: "ntf_5", title: "New sponsor agreement signed", body: "Wide World Capital — Gold tier, $95,000.", time: "2 days ago", type: "success", unread: false },
];

export const activities = [
  { id: "act_1", actor: "Marcus Feld", action: "published", target: "Global AI Innovation Summit 2026", time: "12 minutes ago" },
  { id: "act_2", actor: "Dr. Elena Marković", action: "scored submission", target: "SUB-2291", time: "48 minutes ago" },
  { id: "act_3", actor: "Neural Nomads", action: "submitted", target: "SignBridge v3", time: "2 hours ago" },
  { id: "act_4", actor: "Ananya Iyer", action: "updated permissions for", target: "Event Manager role", time: "5 hours ago" },
  { id: "act_5", actor: "System", action: "generated certificates for", target: "Hack the Campus", time: "Yesterday" },
  { id: "act_6", actor: "Grace Mensah", action: "completed evaluation of", target: "Fintech Growth Simulation", time: "Yesterday" },
];

export const deadlines = [
  { id: "dl_1", title: "Round 2 evaluation lock", event: "AI for Accessibility Track", due: "In 2 days", progress: 68, severity: "warning" },
  { id: "dl_2", title: "Registration close", event: "Northwind Hack the Campus", due: "In 5 days", progress: 97, severity: "info" },
  { id: "dl_3", title: "Sponsor deliverables report", event: "Wide World Founders Pitch Night", due: "In 8 days", progress: 40, severity: "info" },
  { id: "dl_4", title: "Certificate batch approval", event: "Case Study Cup", due: "Overdue by 1 day", progress: 82, severity: "error" },
];

export const registrationTrend = [
  { month: "Feb", registrations: 3120, participants: 2410, revenue: 42000 },
  { month: "Mar", registrations: 4180, participants: 3260, revenue: 51500 },
  { month: "Apr", registrations: 3890, participants: 3010, revenue: 48800 },
  { month: "May", registrations: 5240, participants: 4180, revenue: 67200 },
  { month: "Jun", registrations: 6110, participants: 4920, revenue: 79400 },
  { month: "Jul", registrations: 7460, participants: 6080, revenue: 94100 },
  { month: "Aug", registrations: 8320, participants: 6840, revenue: 108600 },
];

export const categoryMix = [
  { name: "Hackathons", value: 38 },
  { name: "Case Studies", value: 24 },
  { name: "Challenges", value: 18 },
  { name: "Summits", value: 12 },
  { name: "Olympiads", value: 8 },
];

export const evaluationLoad = [
  { round: "Round 1", pending: 42, completed: 186 },
  { round: "Round 2", pending: 88, completed: 124 },
  { round: "Semi-final", pending: 24, completed: 61 },
  { round: "Final", pending: 9, completed: 32 },
];

export const revenueByPlan = [
  { plan: "Enterprise", revenue: 68900, growth: 14.2 },
  { plan: "Growth", revenue: 24100, growth: 9.4 },
  { plan: "Starter", revenue: 6400, growth: -2.1 },
  { plan: "Add-ons", revenue: 9200, growth: 21.7 },
];

export const participationByRegion = [
  { region: "APAC", participants: 24800, teams: 3120 },
  { region: "EMEA", participants: 18400, teams: 2410 },
  { region: "NA", participants: 15200, teams: 1980 },
  { region: "LATAM", participants: 6100, teams: 820 },
  { region: "MEA", participants: 4300, teams: 560 },
];

export const funnel = [
  { stage: "Page views", value: 184200 },
  { stage: "Registrations", value: 42800 },
  { stage: "Teams formed", value: 12400 },
  { stage: "Submissions", value: 8960 },
  { stage: "Evaluated", value: 7410 },
];

export const scheduleItems = [
  { id: "sch_1", day: "Day 1 — 14 Sep", time: "09:00 – 10:00", title: "Opening keynote: Responsible AI at scale", track: "Main Stage", speaker: "Dr. Elena Marković", type: "Keynote" },
  { id: "sch_2", day: "Day 1 — 14 Sep", time: "10:30 – 12:30", title: "Team formation & problem statement release", track: "Hall B", speaker: "Marcus Feld", type: "Workshop" },
  { id: "sch_3", day: "Day 1 — 14 Sep", time: "14:00 – 18:00", title: "Hacking block 1", track: "Arena", speaker: "—", type: "Build" },
  { id: "sch_4", day: "Day 2 — 15 Sep", time: "09:30 – 11:00", title: "Mentor office hours", track: "Pods 1–8", speaker: "12 mentors", type: "Mentoring" },
  { id: "sch_5", day: "Day 2 — 15 Sep", time: "16:00 – 18:00", title: "Round 1 judging", track: "Jury Room", speaker: "9 judges", type: "Judging" },
  { id: "sch_6", day: "Day 3 — 16 Sep", time: "11:00 – 13:00", title: "Finals & awards ceremony", track: "Main Stage", speaker: "Leadership panel", type: "Ceremony" },
];

export const scorecardCriteria = [
  { id: "cr_1", label: "Problem understanding", weight: 20, score: 17, notes: "Clear articulation of accessibility gap with cited research." },
  { id: "cr_2", label: "Technical execution", weight: 30, score: 26, notes: "On-device inference is impressive; latency budget documented." },
  { id: "cr_3", label: "Innovation", weight: 20, score: 15, notes: "Captioning approach is incremental but well applied." },
  { id: "cr_4", label: "Impact potential", weight: 20, score: 18, notes: "Strong pilot commitments from two partner schools." },
  { id: "cr_5", label: "Presentation", weight: 10, score: 8, notes: "Demo was crisp; slides slightly dense." },
];

export const comments = [
  { id: "cm_1", author: "Dr. Elena Marković", role: "Lead Judge", time: "2 hours ago", body: "Strong technical depth. Please confirm the offline model size before the final round." },
  { id: "cm_2", author: "Marcus Feld", role: "Event Manager", time: "Yesterday", body: "Team requested an extension for hardware shipping delays — approved for 24 hours." },
  { id: "cm_3", author: "Rhea Kapoor", role: "Team Lead", time: "2 days ago", body: "Uploaded the revised architecture diagram and updated the demo video link." },
];

export const attachments = [
  { id: "at_1", name: "signbridge-technical-brief.pdf", size: "2.4 MB", type: "PDF", uploaded: "2026-08-05" },
  { id: "at_2", name: "demo-walkthrough.mp4", size: "84.1 MB", type: "Video", uploaded: "2026-08-05" },
  { id: "at_3", name: "architecture-diagram.png", size: "612 KB", type: "Image", uploaded: "2026-08-04" },
  { id: "at_4", name: "impact-model.xlsx", size: "148 KB", type: "Spreadsheet", uploaded: "2026-08-01" },
];

export const timeline = [
  { id: "tl_1", title: "Submission received", detail: "SignBridge v3 uploaded by Rhea Kapoor", time: "05 Aug, 14:22", state: "done" as const },
  { id: "tl_2", title: "Plagiarism & eligibility check", detail: "Automated checks passed with 0 flags", time: "05 Aug, 14:31", state: "done" as const },
  { id: "tl_3", title: "Round 2 evaluation", detail: "2 of 3 reviewers have submitted scorecards", time: "In progress", state: "current" as const },
  { id: "tl_4", title: "Finalist shortlist", detail: "Scheduled after evaluation lock", time: "09 Sep", state: "upcoming" as const },
  { id: "tl_5", title: "Awards & certificates", detail: "Automated certificate batch", time: "17 Sep", state: "upcoming" as const },
];

export const kanbanColumns = [
  { id: "k1", title: "Submitted", items: [submissions[0], submissions[5]] },
  { id: "k2", title: "Under review", items: [submissions[1]] },
  { id: "k3", title: "Scored", items: [submissions[3]] },
  { id: "k4", title: "Decided", items: [submissions[4]] },
];
