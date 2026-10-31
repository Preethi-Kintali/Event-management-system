# Startup Project Documentation Template

---

# 1. Cover Page

- **Project Name**: Eventura (powered by Clientura)
- **Version**: `1.0.0`
- **Document Version**: `1.0`
- **Prepared By**: Senior Full-Stack Engineering & Enterprise Architecture Team
- **Last Updated**: October 21, 2026

---

# 2. Project Summary

- **Purpose of the Project**:
  Eventura is an enterprise-grade multi-tenant event, competition, and hackathon management platform designed for universities, enterprises, and tech communities. It streamlines the end-to-end event lifecycle from initial hackathon proposal submission, multi-tenant approval, registration, team formation, problem statement locking, submission management, and multi-round judging, to automated QR attendance, tamper-proof certificate issuance, and analytics reporting.

- **Business Problem It Solves**:
  Traditional event and hackathon operations suffer from fragmented toolchains (spreadsheets for attendance, separate submission forms, disconnected judging portals, unverified certificates, and manual payment tracking). Eventura unifies all stakeholders into a single, cohesive, auditable platform with strict role-based access control and tenant data isolation.

- **Intended Users**:
  1. **Participants / Hackers**: Discover events, register individual/teams, pick problem statements, submit deliverables, connect with mentors, and earn verified certificates.
  2. **Student & Faculty Coordinators**: Manage operational logistics, room assignments, attendee attendance, and hackathon proposals.
  3. **Event Managers**: Oversee entire events, configure competition tracks, set submission deadlines, assign judges, and review final analytics.
  4. **Judges / Evaluators**: Review assigned team submissions in a view-only sandboxed interface, grade against rubric criteria, and provide structured qualitative feedback.
  5. **Mentors**: Answer technical questions submitted by participants in an asynchronous Q&A thread.
  6. **Organization & Platform Admins**: Manage tenant subscriptions, users, audit logs, licenses, and RBAC policies.

- **Current Status**:
  **Production Ready (Pre-Launch Verified)** — Feature complete, hardened against security bypasses, multi-tenant stress tested, and production build validated.

---

# 3. Business Context

- **Why Was This Project Built?**
  Organizations and educational institutions host large-scale hackathons and innovation sprints but lack enterprise tooling that supports multi-tenant isolation, automated round progressions, verifiable digital credentials, and real-time sponsor/recruitment analytics. Eventura was built to deliver a modern, high-performance solution that handles thousands of concurrent operations without data leakage.

- **What Problem Does It Solve?**
  - **Eliminates Manual Chaos**: Eliminates spreadsheet coordination, lost submissions, and uncoordinated judge scorecards.
  - **Enforces Academic & Corporate Integrity**: Permanent problem statement selection, deadline enforcement, and strict judge-to-submission RBAC prevent score tampering and double-submissions.
  - **Streamlines Verification**: Instant QR code check-ins and cryptographic certificate verification links eliminate fraudulent credential claims.

- **Expected Business Value**:
  - **90% Reduction in Operational Overhead**: Event coordinators configure and execute hackathons in minutes rather than weeks.
  - **Zero Crosstalk Multi-Tenancy**: Multiple universities or corporate departments run parallel competitions on shared infrastructure with 100% data isolation.
  - **Sponsor & Recruitment ROI**: Real-time recruitment talent search and sponsor engagement dashboards justify sponsorships and generate institutional revenue.

---

# 4. System Overview

Eventura is structured around a decoupled, modular full-stack architecture featuring a server-side rendered (SSR) React frontend powered by Vite and TanStack Router/Query, backed by an Express REST API with Prisma ORM persisting to PostgreSQL.

### High-Level Architecture Diagram

```mermaid
graph TD
    Client["Client Browsers (Desktop / Mobile PWA)"]
    
    subgraph Edge & Frontend Layer
        CDN["Reverse Proxy / TLS Termination (Cloudflare / NGINX)"]
        Nitro["SSR Server (Nitro / TanStack Start)"]
        ReactApp["React 19 + TanStack Router + Tailwind CSS"]
    end
    
    subgraph Application & Security Gateway
        Express["Express.js REST API Server"]
        AuthMiddleware["JWT & TOTP MFA Auth Guard"]
        TenantMiddleware["Strict Tenant Guard (x-organization-id)"]
        RBACMiddleware["Granular RBAC Engine"]
    end
    
    subgraph Core Services Layer
        AuthService["Auth & Session Service"]
        EventService["Event & Competition Service"]
        RegService["Registration & Payment (Stripe) Service"]
        SubService["Submission & View-Only Doc Service"]
        JudgeService["Evaluation & Scoring Service"]
        CertService["Certificate & QR PDF Engine"]
        AnalyticsService["BI & Reporting Service"]
    end
    
    subgraph Persistence & Infrastructure
        Postgres[(PostgreSQL 15+ Relational DB)]
        Storage[(Persistent File / PDF Storage)]
        Redis[(Redis Cache / Rate Limiting)]
    end

    Client --> CDN
    CDN --> Nitro
    Nitro --> ReactApp
    ReactApp -->|REST API over HTTPS| Express
    Express --> AuthMiddleware
    AuthMiddleware --> TenantMiddleware
    TenantMiddleware --> RBACMiddleware
    RBACMiddleware --> AuthService
    RBACMiddleware --> EventService
    RBACMiddleware --> RegService
    RBACMiddleware --> SubService
    RBACMiddleware --> JudgeService
    RBACMiddleware --> CertService
    RBACMiddleware --> AnalyticsService
    
    AuthService --> Postgres
    EventService --> Postgres
    RegService --> Postgres
    SubService --> Postgres
    SubService --> Storage
    JudgeService --> Postgres
    CertService --> Postgres
    CertService --> Storage
    AnalyticsService --> Postgres
```

---

# 5. Technology Stack

| Layer | Technology | Justification & Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | High performance, strict type safety, modern concurrent rendering features. |
| **Routing & Hydration** | TanStack Router + TanStack Start (Nitro) | Type-safe search params and nested routing with fast SSR initial load. |
| **Client State & Caching** | TanStack Query v5 | Automatic background refetching, query invalidation, and deduplication. |
| **Styling & Components** | Tailwind CSS + Radix UI + Lucide | Accessible, composable primitives with responsive dark-mode glassmorphic theme. |
| **Backend Framework** | Node.js + Express + TypeScript | Lightweight, non-blocking I/O with clean Route → Middleware → Controller → Service → Repository patterns. |
| **Database & ORM** | PostgreSQL 15 + Prisma ORM | Relational integrity, ACID multi-record transactions, composite indexes, and type-safe migrations. |
| **Security & Auth** | bcrypt + JWT + otplib (TOTP) | Cryptographic password hashing, short-lived JWT sessions, and universal multi-factor authentication. |
| **Validation** | Zod (Client & Server) | Unified schema validation preventing invalid inputs or malformed payloads at the perimeter. |
| **External Payment** | Stripe API (Checkout & Webhooks) | Secure PCI-compliant ticket purchases, team registrations, and idempotency tracking. |
| **AI Integration** | Google Gemini Generative AI SDK | AI-assisted project classification, automatic proposal summarization, and mentor copilot. |

---

# 6. Major Modules

### Module 1: Authentication & Access Control (RBAC)
- **Purpose**: Authenticate users and enforce granular role permissions.
- **Responsibilities**: Password hashing, JWT issuance/revocation, TOTP MFA challenge-response, role assignment.
- **Main Features**: Public Participant signup, login with animated mascot, MFA verification, permission checking middleware.
- **Dependencies**: `bcrypt`, `jsonwebtoken`, `otplib`, `prisma`.

### Module 2: Multi-Tenant Workspace & Organization Engine
- **Purpose**: Guarantee strict logical data separation between institutions and companies.
- **Responsibilities**: Validate `x-organization-id` header against user active memberships; reject cross-tenant access.
- **Main Features**: Organization creation, domain binding, member onboarding, license tracking, multi-tenant event scoping.
- **Dependencies**: `tenant.middleware.ts`, `prisma.organizationMember`.

### Module 3: Event & Competition Lifecycle
- **Purpose**: Manage hackathon and event creation, approval, and execution.
- **Responsibilities**: Track proposals, stages (DRAFT, PUBLISHED, REGISTRATION_OPEN, ONGOING, COMPLETED), rounds, and rules.
- **Main Features**: Hackathon proposals submission and manager approval, team size bounds (`minTeamSize`, `maxTeamSize`), schedule management.
- **Dependencies**: `hackathon-proposals.service.ts`, `events.service.ts`.

### Module 4: Registration & Team Formation
- **Purpose**: Handle individual and team registrations with ticket pricing and invite management.
- **Responsibilities**: Validate team size boundaries, prevent duplicate user registrations, enforce team lead allocations.
- **Main Features**: Free/paid event registration, Stripe checkout integration, team invite links, team management.
- **Dependencies**: `registrations.service.ts`, `payments.service.ts`.

### Module 5: Problem Statement Selection
- **Purpose**: Distribute hackathon challenges and track team problem assignments.
- **Responsibilities**: Enforce event-specific availability, eligibility checks, and permanent selection lock rules.
- **Main Features**: Event-scoped problem statement lists, problem statement detail view, single permanent choice lock.
- **Dependencies**: `problem-statements.service.ts`.

### Module 6: Submission Engine & Protected Document Viewer
- **Purpose**: Ingest project artifacts, GitHub repositories, demo links, and uploaded files.
- **Responsibilities**: Enforce round deadlines, validate file types, serve files via protected view-only streaming.
- **Main Features**: Submission dialog, deadline countdown, authorized inline document preview (`Content-Disposition: inline`).
- **Dependencies**: `submissions.service.ts`, `submissions.controller.ts`.

### Module 7: Evaluation & Scoring Engine
- **Purpose**: Enable judges to evaluate submissions against quantitative rubrics and qualitative feedback.
- **Responsibilities**: Assign judges to competitions, validate score caps (`maxScore`), calculate real-time leaderboard rankings.
- **Main Features**: Judge assignment dialog, rubric scorecard, evaluation status persistence, live leaderboard.
- **Dependencies**: `evaluations.service.ts`, `leaderboard.tsx`.

### Module 8: Attendance & QR Check-In
- **Purpose**: Track physical and virtual attendee participation.
- **Responsibilities**: Generate unique signed QR codes, scan at entry gates, log check-in/check-out timestamps.
- **Main Features**: QR code scanner via `html5-qrcode`, session management, live attendance percentage metrics.
- **Dependencies**: `attendance.service.ts`, `qrcode.react`.

### Module 9: Certificate Generation & Verification
- **Purpose**: Issue cryptographic, tamper-proof completion and winner certificates.
- **Responsibilities**: Generate unique verification codes, render PDF certificates, provide public verification route.
- **Main Features**: Public verify URL (`/certificates/verify/:code`), downloadable PDF, revocation support.
- **Dependencies**: `certificates.service.ts`, `pdfkit`.

### Module 10: Reports & Analytics Hub
- **Purpose**: Provide executive KPIs, financial metrics, and operational performance indicators.
- **Responsibilities**: Aggregate registrations, revenue, attendance rates, scoring distributions, and exports.
- **Main Features**: CSV/PDF exports, revenue MTD/MRR breakdown, team progression charts.
- **Dependencies**: `reports.service.ts`, `recharts`.

---

# 7. System Workflow

### End-to-End Hackathon Lifecycle Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor Participant
    actor Coordinator
    actor Manager
    actor Judge

    Note over Coordinator,Manager: Phase 1: Proposal & Event Setup
    Coordinator->>Manager: Submit Hackathon Proposal (Budget, Tracks, Dates)
    Manager->>Coordinator: Review & Approve Proposal
    Manager->>Manager: Publish Event & Configure Rounds, Rubrics, Problem Statements

    Note over Participant,Manager: Phase 2: Registration & Team Formation
    Participant->>Participant: Sign Up (Role: Participant)
    Participant->>Manager: Register for Event (Individual or Team)
    alt Paid Event
        Participant->>Manager: Checkout via Stripe
        Manager-->>Participant: Payment Confirmed (Status: PAID / REGISTERED)
    else Free Event
        Manager-->>Participant: Registration Approved (Status: APPROVED)
    end

    Note over Participant: Phase 3: Selection & Execution
    Participant->>Participant: Browse Event Problem Statements
    Participant->>Manager: Lock Chosen Problem Statement (Permanent)
    Coordinator->>Participant: Scan QR Code Check-in at Event Gate

    Note over Participant,Judge: Phase 4: Submission & Evaluation
    Participant->>Manager: Submit Deliverable (Repo, Demo, Slides) Before Deadline
    Manager->>Judge: Assign Judge to Competition Submission
    Judge->>Judge: Open View-Only Submission Preview
    Judge->>Manager: Submit Rubric Scores & Qualitative Feedback
    Manager->>Manager: Calculate Leaderboard & Finalists

    Note over Manager,Participant: Phase 5: Results & Certification
    Manager->>Manager: Finalize Winners & Publish Leaderboard
    Manager->>Participant: Issue Digital Certificates with Cryptographic QR Code
    Participant->>Participant: Download PDF / Share Verification Link
```

---

# 8. Data Model

### Key Entities & Relationship Map

```mermaid
erDiagram
    ORGANIZATION ||--o{ ORGANIZATION_MEMBER : has
    ORGANIZATION ||--o{ EVENT : owns
    ORGANIZATION ||--o{ ROLE : defines
    
    USER ||--o{ ORGANIZATION_MEMBER : participates
    USER ||--o{ REGISTRATION : registers
    USER ||--o{ CERTIFICATE : receives
    USER ||--o{ AUDIT_LOG : triggers

    ROLE ||--o{ ROLE_PERMISSION : grants
    ROLE ||--o{ ORGANIZATION_MEMBER : assigns

    EVENT ||--o{ COMPETITION : contains
    EVENT ||--o{ REGISTRATION : receives
    EVENT ||--o{ TEAM : hosts
    EVENT ||--o{ PROBLEM_STATEMENT : features
    EVENT ||--o{ ATTENDANCE_SESSION : schedules
    EVENT ||--o{ CERTIFICATE : issues

    COMPETITION ||--o{ ROUND : consists_of
    ROUND ||--o{ SUBMISSION : accepts
    ROUND ||--o{ JUDGE_ASSIGNMENT : assigns

    TEAM ||--o{ TEAM_MEMBER : has
    TEAM ||--o{ SUBMISSION : submits
    TEAM }o--|| PROBLEM_STATEMENT : selects

    SUBMISSION ||--o{ EVALUATION : evaluated_by
    USER ||--o{ EVALUATION : judges
```

### Summary of Key Tables
- **`Organization`**: Multi-tenant container separating data, branding, and billing.
- **`User`**: Global identity entity storing password hash, email, profile, and MFA secret.
- **`OrganizationMember`**: Join record binding a User to an Organization with a specific Role.
- **`Event`**: Hackathon or conference record holding dates, ticket fees, participant caps, and status.
- **`Registration`**: Event registration ticket tracking status (`PENDING`, `APPROVED`, `PAID`, `CONFIRMED`).
- **`Team` & `TeamMember`**: Collaborative hacker squads with leader designation and size validations.
- **`ProblemStatement`**: Technical challenge briefs associated with events and locked by teams.
- **`Submission` & `SubmissionFile`**: Project repositories, slide decks, and artifacts uploaded per round.
- **`Evaluation`**: Quantitative rubric scores and qualitative feedback submitted by judges.
- **`Certificate`**: Verifiable credential records storing unique SHA verification codes and PDF links.

---

# 9. External Integrations

| Provider | Purpose | Integration Type | Authentication |
|---|---|---|---|
| **Stripe** | Paid ticket transactions, team entry fees, subscription billing | REST API + Webhooks | Live Secret Key + Webhook Signing Secret |
| **Google Gemini AI** | Smart proposal classification, AI mentor assistant, rubric summaries | Gemini Node SDK | API Key (`GEMINI_API_KEY`) |
| **PostgreSQL 15+** | Relational primary data store | TCP via Prisma Driver | Connection URI with credentials |
| **Redis** *(Optional)* | Session store, distributed cache, API rate limiting | In-Memory Key-Value | Connection URI (`REDIS_URL`) |
| **SMTP Provider** | Account welcome emails, password resets, registration invites | SMTP / Nodemailer | Host, Port, User, TLS Password |

---

# 10. Configuration

### Environment Variables Specification

> [!NOTE]
> All credentials must be provisioned via secret management systems. Never commit values to version control.

| Variable Name | Environment | Required | Description |
|---|---|---|---|
| `NODE_ENV` | All | Yes | Node environment (`development` / `production`). |
| `PORT` | Backend | Yes | Port on which the API listens (default: `3000`). |
| `DATABASE_URL` | Backend | Yes | PostgreSQL connection string (`postgresql://user:pass@host:5432/db`). |
| `JWT_SECRET` | Backend | Yes | High-entropy secret for signing access tokens. |
| `JWT_REFRESH_SECRET` | Backend | Yes | High-entropy secret for signing refresh tokens. |
| `FRONTEND_URL` | Backend | Yes | Public HTTPS URL of the client for CORS validation (`https://...`). |
| `STRIPE_SECRET_KEY` | Backend | Optional | Stripe API secret key for payment processing. |
| `STRIPE_WEBHOOK_SECRET` | Backend | Optional | Stripe webhook signature verification key. |
| `GEMINI_API_KEY` | Backend | Optional | Google Gemini Generative AI API key. |
| `REDIS_URL` | Backend | Optional | Redis connection string for caching and distributed locks. |

### Critical Configuration Files
- [package.json](file:///e:/projects/event_management/package.json): Root script definitions (`npm run build`, `npm run test:smoke`, `npm run server`).
- [prisma/schema.prisma](file:///e:/projects/event_management/prisma/schema.prisma): Database models, relations, indexes, and PostgreSQL generator.
- [vite.config.ts](file:///e:/projects/event_management/vite.config.ts): Frontend bundler, alias paths (`@/`), and TanStack Start plugins.
- [server/src/app.ts](file:///e:/projects/event_management/server/src/app.ts): Express server configuration, middleware chain, security headers, CORS, and route mounting.

---

# 11. Deployment Overview

### Deployment Environments
1. **Local Development**:
   - Backend on `http://localhost:3000` via `npm run dev:server`
   - Frontend Vite on `http://localhost:8080` via `npm run dev`
   - PostgreSQL daemon running locally on port `5432`.
2. **Staging**:
   - Mirror of production with Stripe Test Mode enabled and isolated staging PostgreSQL database.
3. **Production**:
   - High-availability PostgreSQL database with automated daily snapshots.
   - Frontend SSR bundle deployed via Nitro (`node .output/server/index.mjs`) behind Cloudflare / NGINX reverse proxy.
   - Backend Express API deployed as a persistent service behind HTTPS reverse proxy with load balancing.

### Deployment Architecture Diagram

```mermaid
graph LR
    User["End User (HTTPS)"]
    DNS["DNS & WAF (Cloudflare)"]
    Proxy["NGINX Reverse Proxy / SSL"]
    
    subgraph Hosting Infrastructure
        FE["Nitro SSR Node Server (Port 8080)"]
        BE["Express API Server (Port 3000)"]
        DB[(PostgreSQL Primary + Replicas)]
        Volume["Persistent Uploads Volume"]
    end

    User --> DNS
    DNS --> Proxy
    Proxy -->|Paths: /api/*| BE
    Proxy -->|Paths: /*| FE
    BE --> DB
    BE --> Volume
```

---

# 12. Project Structure

```text
event_management/
├── package.json                   # Root package definitions and test scripts
├── vite.config.ts                 # Vite and TanStack Start build configuration
├── tsconfig.json                  # Root TypeScript compiler options
├── prisma/                        # Database schema & migration management
│   ├── schema.prisma              # Complete PostgreSQL schema & relations
│   ├── migrations/                # Forward-only SQL migrations
│   ├── seed.ts                    # Default admin, roles, and permission seeds
│   └── scripts/                   # Idempotent permission sync scripts
├── scripts/                       # Automated quality & testing scripts
│   ├── smoke-test.ts              # End-to-end smoke verification test suite
│   ├── stress-test-multi-event.ts # Multi-tenant 5-track concurrency stress suite
│   └── test-routing.ts            # 116-route frontend & backend matrix suite
├── server/                        # Express API Backend
│   └── src/
│       ├── index.ts               # Server bootstrap & port listener
│       ├── app.ts                 # Express middleware, CORS, rate limits, routes
│       ├── controllers/           # HTTP controllers for all domain resources
│       ├── services/              # Business logic & transaction boundaries
│       ├── repositories/          # Prisma database access layer
│       ├── middleware/            # Auth, Tenant, and RBAC security guards
│       ├── validators/            # Zod request payload validation schemas
│       └── routes/                # Modular REST route mappings
└── src/                           # TanStack Start / React Frontend
    ├── main.tsx                   # Client hydration entrypoint
    ├── routes/                    # File-based routes (TanStack Router)
    │   ├── index.tsx              # Landing page
    │   ├── login.tsx              # Login portal with mascot animation
    │   ├── signup.tsx             # Public Participant registration
    │   ├── events.tsx             # Event management & detail views
    │   ├── judge.*.tsx            # Judge evaluation workspace
    │   ├── manager.*.tsx          # Event manager control center
    │   └── participant.*.tsx      # Participant event & team hub
    ├── modules/                   # Domain component modules
    │   ├── events/                # Event creation, cards, schedules
    │   ├── submissions/           # File uploads, dialogs, doc viewers
    │   ├── evaluations/           # Scorecards, rubrics, ranking tables
    │   └── platform-admin/        # User, role, and license management
    ├── components/                # Shared design system components (shadcn/ui)
    └── lib/                       # API client, utility functions, auth helpers
```

---

# 13. Known Limitations

- **Horizontal Scaling of Local Uploads**:
  Uploaded submission files currently store on local disk by default. In multi-instance auto-scaling environments, persistent NFS mounts or an S3-compatible object storage provider (e.g. AWS S3, Cloudflare R2) should be configured.
- **WebSocket Scaling for Live Scoring**:
  Live leaderboard updates currently leverage polling with TanStack Query. For stadium hackathons with tens of thousands of concurrent viewers, a Redis Pub/Sub WebSocket gateway can further reduce HTTP polling overhead.
- **Rate Limit Storage**:
  `express-rate-limit` currently operates in-memory. For clustered multi-node API deployments, backing rate limiting with a shared Redis store ensures synchronized limits across all instances.

---

# 14. Maintenance Notes

- **Scheduled Jobs**:
  - Nightly expired JWT token and stale session cleanup.
  - Automated WAL archive logs rotation and database snapshot generation.
- **Backup Strategy**:
  - Run full compressed backups before deployments:
    ```bash
    pg_dump -h <HOST> -U <USER> -d <DB> -F c -b -v -f ./backup_$(date +%Y%m%d).dump
    ```
- **Logging & Monitoring**:
  - Health endpoint at `GET /api/v1/health` for automated uptime pinging.
  - Formatted Winston / JSON error logs with request context (method, path, user ID, tenant ID).
- **Common Troubleshooting**:
  - *HTTP 400 `MISSING_TENANT`*: Ensure frontend requests include the `x-organization-id` header corresponding to the active workspace.
  - *HTTP 401 `INVALID_CREDENTIALS`*: Verify user account is not locked and credentials match bcrypt hash.
  - *HTTP 403 `UNAUTHORIZED`*: Verify role permissions in database (`prisma/scripts/sync-reports-permissions.ts`).

---

# 15. Changelog

| Version | Date | Changes & Milestones |
|---|---|---|
| `1.0.0` | 2026-10-21 | **Production Optimization & Deployment Release**: Enforced universal MFA (removed hardcoded bypasses); eliminated silent tenant fallbacks; fixed participant problem statement eligibility checks; added protected inline view-only submission file endpoint; removed elevated roles from public `/signup`; synced `reports.read`/`reports.export` RBAC permissions; verified 100% route pass rate (116/116 routes) and multi-event concurrency stress tests. |
| `0.9.0` | 2026-10-15 | **Phase 4 Remediations**: Implemented recruitment, sponsors, learning, community, and feedback analytics dashboards; added winner prizes and badge achievements. |
| `0.8.0` | 2026-10-01 | **Security & Multi-Tenant Audit**: Added strict organization member role isolation, tamper-proof certificate verification routes, and QR attendance scanning engine. |
| `0.1.0` | 2026-08-15 | **Initial MVP**: Core event creation, team registration, and basic submission flow. |

---

# 16. References & Separate Documents

For detailed implementation and operational guidelines, refer to the following companion documents in the project repository:

1. [CODE_OPTIMIZATION_REPORT.md](file:///e:/projects/event_management/CODE_OPTIMIZATION_REPORT.md): Detailed audit report covering inspected files, confirmed root causes, before/after benchmarks, and regression test logs.
2. [DEPLOYMENT_CHECKLIST.md](file:///e:/projects/event_management/DEPLOYMENT_CHECKLIST.md): Step-by-step production runbook covering environment variables, migration steps, start commands, and rollback procedures.
3. [prisma/schema.prisma](file:///e:/projects/event_management/prisma/schema.prisma): Complete PostgreSQL relational schema definition.
4. [README.md](file:///e:/projects/event_management/README.md): Developer quickstart, architecture summary, and environment setup instructions.
