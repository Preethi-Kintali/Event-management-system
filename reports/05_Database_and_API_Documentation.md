# [5] Database and API Documentation
**Project**: Eventura (powered by Clientura) — Enterprise Event & Hackathon Platform  
**Document Version**: 1.0.0  
**Date**: October 29, 2026  
**Audience**: Backend Engineers, Database Administrators, API Consumers, Integration Partners  

---

## 1. Database Architecture & Engine Overview

Eventura utilizes **PostgreSQL 15+** as its primary persistent relational datastore, managed and queried through **Prisma ORM**. The data tier enforces ACID transactions, foreign key constraints, composite unique indexes, and audit timestamps across all tables.

### 1.1 Key Database Characteristics
- **Relational Integrity**: Strict cascading rules (`ON DELETE CASCADE` or `RESTRICT`) to ensure orphan records cannot exist.
- **Multi-Tenant Composite Keys**: Critical tables enforce composite unique constraints (e.g. `[organizationId, slug]`, `[eventId, userId]`) to prevent duplicate records within the same tenant.
- **Audit Tracking**: Every domain entity contains `createdAt` and `updatedAt` timestamps, with soft-deletion support (`deletedAt`) on sensitive operational tables.
- **Migration Discipline**: All schema changes are tracked in forward-only SQL migration files in `prisma/migrations/`.

---

## 2. Relational Entity Catalog

The database schema encompasses 45+ relational entities categorized into 7 core functional clusters:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CORE DATABASE ENTITY CLUSTERS                      │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 1. Identity & Security       │ User, UserMfa, UserRecoveryCode, Session,    │
│                              │ AuditLog, SecurityEvent                      │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 2. Multi-Tenancy & RBAC      │ Organization, OrganizationMember, Role,      │
│                              │ Permission, RolePermission, ApiKey           │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 3. Event Lifecycle           │ Event, Competition, Round, ProblemStatement, │
│                              │ HackathonProposal, EventFinalReport          │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 4. Teams & Registrations     │ Registration, Team, TeamMember, Payment,     │
│                              │ Coupon, Invoice, Refund                      │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 5. Submissions & Judging     │ Submission, SubmissionFile, Evaluation,      │
│                              │ Rubric, SubmissionJudgeAssignment, Judge    │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 6. Operations & Credentials  │ AttendanceSession, AttendanceRecord,         │
│                              │ Certificate, Badge, BadgeAward, Prize, Winner│
├──────────────────────────────┼──────────────────────────────────────────────┤
│ 7. Community & Analytics     │ Discussion, DiscussionReply, Course,         │
│                              │ JobPosting, LearningResource, SurveyResponse │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### 2.1 Identity & Multi-Tenancy Schema Details
- **`User`**: Core identity table storing UUID, unique email, bcrypt `passwordHash`, first/last names, and operational status (`ACTIVE`, `PENDING`, `SUSPENDED`).
- **`UserMfa`**: Stores base32 TOTP secret, enrollment status, and last verification timestamp.
- **`Organization`**: Multi-tenant workspace entity storing UUID, human-readable name, unique URL slug, and lifecycle status.
- **`OrganizationMember`**: Join record mapping `userId` to `organizationId` with assigned `roleId`.
- **`Role` & `Permission`**: Decoupled RBAC definition allowing tenants to define custom access rules.

### 2.2 Event & Hackathon Competition Details
- **`Event`**: Stores event title, description, banner URL, venue/mode (IN_PERSON, VIRTUAL, HYBRID), dates, registration deadlines, max team sizes, and status (`DRAFT`, `PUBLISHED`, `REGISTRATION_OPEN`, `ONGOING`, `COMPLETED`).
- **`Competition` & `Round`**: Defines event tracks, multi-round elimination schedules, and specific judging rubrics.
- **`ProblemStatement`**: Technical briefs published per event. When a team registers their choice, `Team.problemStatementId` is locked.
- **`Submission` & `SubmissionFile`**: Stores project deliverables, GitHub repository links, demo URLs, file sizes, MIME types, and local/S3 storage paths.
- **`Evaluation`**: Quantitative scores and qualitative feedback recorded by assigned judges.

---

## 3. RESTful API Specification

The Eventura backend exposes a uniform REST API mounted at `/api/v1`.

### 3.1 Global Conventions & Headers
- **Base URL**: `https://<API_DOMAIN>/api/v1`
- **Authentication**: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Tenant Scope**: `x-organization-id: <ORGANIZATION_UUID>` (Required for all tenant-scoped endpoints)
- **Content Type**: `Content-Type: application/json`

### 3.2 Standard Response Schemas
**Success Response (HTTP 200 / 201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error Response (HTTP 400 / 401 / 403 / 404 / 500):**
```json
{
  "success": false,
  "error": {
    "code": "MISSING_TENANT",
    "message": "x-organization-id header is required for this route",
    "details": []
  }
}
```

---

## 4. Complete API Endpoints Catalog

Below is the definitive catalog of all 40 API route groups mounted in `server/src/routes/`:

### 4.1 Authentication & Profile (`/auth`, `/users`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `POST` | `/auth/signup` | Public | None | Register new participant account |
| `POST` | `/auth/login` | Public | None | Authenticate with email/password; returns JWT or MFA challenge |
| `POST` | `/auth/mfa/verify` | Public | Temp MFA Token | Validate 6-digit TOTP code and issue session JWT |
| `POST` | `/auth/refresh` | Optional | Refresh Token | Issue new access token using refresh token |
| `POST` | `/auth/logout` | Required | Any Authenticated | Invalidate active user session |
| `GET` | `/users/me` | Required | Any Authenticated | Retrieve current user profile and memberships |
| `PUT` | `/users/me` | Required | Any Authenticated | Update current user profile details |
| `GET` | `/users` | Required | `users.read` | List organization users with pagination |
| `PUT` | `/users/:id/role` | Required | `users.manage` | Update a user's role in the organization |

### 4.2 Multi-Tenant Organizations (`/organizations`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `GET` | `/organizations` | Required | Any Authenticated | List organizations where user has active membership |
| `POST` | `/organizations` | Required | `org.create` / Sudo | Create a new organization tenant workspace |
| `GET` | `/organizations/:id` | Required | Member | Get details and settings for specific organization |
| `PUT` | `/organizations/:id` | Required | `org.manage` | Update organization settings and domain branding |
| `GET` | `/organizations/:id/members` | Required | `org.members.read` | List members and their assigned roles |
| `POST` | `/organizations/:id/members` | Required | `org.members.invite` | Invite new member to organization |

### 4.3 Events & Competitions (`/events`, `/competitions`, `/hackathon-proposals`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `GET` | `/events` | Tenant | Public / Member | List events scoped to tenant workspace |
| `POST` | `/events` | Required | `events.create` | Create a new event draft |
| `GET` | `/events/:id` | Tenant | Public / Member | Retrieve comprehensive event details, rounds, tracks |
| `PUT` | `/events/:id` | Required | `events.manage` | Update event information, schedule, or banners |
| `DELETE` | `/events/:id` | Required | `events.delete` | Soft delete event |
| `POST` | `/events/:id/publish` | Required | `events.publish` | Transition event status to `PUBLISHED` |
| `GET` | `/hackathon-proposals` | Required | `proposals.read` | List hackathon proposals submitted by coordinators |
| `POST` | `/hackathon-proposals` | Required | `proposals.create` | Submit new hackathon proposal with budget and tracks |
| `POST` | `/hackathon-proposals/:id/approve` | Required | `proposals.approve` | Approve proposal and spawn draft event |
| `POST` | `/hackathon-proposals/:id/reject` | Required | `proposals.reject` | Reject proposal with structured feedback |
| `GET` | `/competitions/:id/rounds` | Tenant | Member | List rounds and stage criteria for competition |

### 4.4 Registrations, Teams & Payments (`/registrations`, `/teams`, `/payments`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `POST` | `/registrations` | Required | Participant | Register for event (individual or team) |
| `GET` | `/registrations/me` | Required | Participant | Get current user's registration tickets and statuses |
| `GET` | `/registrations/event/:id`| Required | `events.manage` | List all registered attendees for an event |
| `POST` | `/teams` | Required | Participant | Create a new team and generate invite code |
| `POST` | `/teams/join` | Required | Participant | Join existing team using invite code |
| `POST` | `/payments/checkout` | Required | Participant | Create Stripe Checkout Session for paid event |
| `POST` | `/payments/webhook` | Public | Stripe Signature | Handle Stripe webhook events (`checkout.session.completed`) |

### 4.5 Problem Statements & Submissions (`/problem-statements`, `/submissions`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `GET` | `/problem-statements` | Tenant | Registered / Staff | List available problem statements for event |
| `POST` | `/problem-statements/select` | Required | Participant (Team Lead) | Permanently lock chosen problem statement for team |
| `POST` | `/submissions` | Required | Participant (Team Member)| Upload deliverable files, GitHub links, demo URL |
| `GET` | `/submissions/round/:roundId`| Required | Judge / Manager | List submissions submitted for specific round |
| `GET` | `/submissions/:id` | Required | Team / Judge / Staff | Get full submission details and attachments |
| `GET` | `/submissions/:id/files/:fileId/view` | Required | Team / Assigned Judge / Staff | **Stream submission file inline for safe view-only preview** |

### 4.6 Judging, Evaluator Scoring & Leaderboard (`/evaluations`, `/judges`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `GET` | `/judges/assigned` | Required | Judge | List competitions and submissions assigned to current judge |
| `POST` | `/judges/assign` | Required | `events.manage` | Assign judge to specific competition round |
| `POST` | `/evaluations` | Required | Judge | Submit rubric criteria scores and qualitative feedback |
| `GET` | `/evaluations/submission/:id` | Required | Judge / Manager | Get submitted scores for a submission |
| `GET` | `/evaluations/leaderboard/:eventId` | Tenant | Member | Get real-time computed leaderboard rankings |

### 4.7 Attendance & Check-In (`/attendance`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `POST` | `/attendance/sessions` | Required | `attendance.manage` | Create check-in session for event (e.g. Day 1 Morning) |
| `GET` | `/attendance/ticket/:regId` | Required | Participant | Get signed QR code token for event entry |
| `POST` | `/attendance/scan` | Required | Coordinator / Staff | Scan attendee QR code and record check-in timestamp |
| `GET` | `/attendance/session/:id/stats` | Required | `attendance.read` | Get real-time check-in counts and attendance rate |

### 4.8 Certificates & Verification (`/certificates`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `POST` | `/certificates/issue` | Required | `certificates.manage` | Issue digital certificates to event participants/winners |
| `GET` | `/certificates/me` | Required | Participant | List certificates awarded to current user |
| `GET` | `/certificates/:id/download` | Required | Recipient / Admin | Download generated vector PDF certificate |
| `GET` | `/certificates/verify/:code` | Public | None | **Public verification endpoint for certificate authenticity** |

### 4.9 Reports & Analytics (`/reports`, `/analytics`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `GET` | `/reports/dashboard` | Required | `reports.read` | Retrieve executive KPI metrics (revenue, attendees, teams) |
| `GET` | `/reports/export/:type` | Required | `reports.export` | Export CSV report for registrations, scores, or attendance |
| `GET` | `/analytics/events/:id` | Required | `analytics.read` | Real-time event engagement and submission metrics |

### 4.10 AI Services (`/ai-copilot`, `/ai-validation`)
| Method | Path | Auth | Roles / Permissions | Description |
|---|---|---|---|---|
| `POST` | `/ai-copilot/query` | Required | Participant / Mentor | Submit technical coding question to Gemini AI Copilot |
| `POST` | `/ai-validation/proposal` | Required | `proposals.manage` | AI risk and feasibility evaluation for hackathon proposal |

### 4.11 Extended Platform Routes
The platform additionally mounts specialized routes for:
- `/badges`: Gamification badges, achievements, and criteria evaluations.
- `/winners`: Winner selection, podium distribution, and prize allocations.
- `/communications` & `/notifications`: Broadcast announcements and notification feeds.
- `/community`: Discussion forums, channels, and networking groups.
- `/learning`: Educational workshops, video modules, and resource libraries.
- `/recruitment`: Talent search and resume pool for event sponsors.
- `/sponsors`: Sponsor tier management and booth analytics.
- `/volunteers`: Volunteer scheduling and shift management.
- `/feedback`: Post-event feedback surveys and NPS scoring.
- `/developer` & `/security`: API key management, webhook logs, and security audit events.

---

## 5. Schema Migration & Synchronization Strategy

1. **Deploying Schema Changes**:
   ```bash
   npx prisma migrate deploy
   ```
2. **Generating Updated Types**:
   ```bash
   npx prisma generate
   ```
3. **Idempotent RBAC Sync**:
   Whenever new route permissions are introduced, execute:
   ```bash
   npx tsx prisma/scripts/sync-reports-permissions.ts
   ```
