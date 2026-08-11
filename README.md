# 🚀 Ascent Platform

> Enterprise Event, Competition & Innovation Management Platform

Ascent is a modern, enterprise-grade platform for managing events, competitions, participants, teams, submissions, evaluations, organizations, certificates, attendance, and innovation programs.

The platform is designed with a scalable multi-tenant architecture and supports role-based access control, secure authentication, PostgreSQL persistence, and a reusable enterprise UI system.

---

## ✨ Features

### 🏢 Platform Administration
- Organization management
- User management
- Role & permission management
- Subscription management
- Audit logging
- Platform configuration

### 🎯 Event Management
- Event creation and management
- Competition management
- Registration management
- Team management
- Submission management
- Event scheduling

### 🧑‍⚖️ Evaluation & Event Operations
- Judge management
- Judge-to-competition assignment
- Submission evaluation
- Scoring and evaluation tracking
- Mentor management
- Team mentor assignment
- Volunteer management
- Event volunteer scheduling
- Attendance sessions
- Check-in / check-out
- Attendance analytics

### 🏆 Certificates
- Certificate management
- Certificate issuance
- Certificate verification
- Certificate revocation
- Certificate analytics

### 🤖 Advanced Platform Features
- AI Validation
- AI Copilot
- Communication Center
- Workflow Automation
- Integration Hub
- Analytics & BI
- Reports
- Notifications
- Security & Compliance
- Developer Administration
- Community & Networking
- Learning & Resource Center
- Badges & Achievements
- Winner Management
- Recruitment
- Sponsor Management

> Advanced modules are progressively being migrated from mock UI implementations to real backend integrations.

---

# 🏗️ Architecture

Ascent follows a modular full-stack architecture.

```text
┌──────────────────────────────────────────────┐
│                  Client                      │
│                                              │
│ React + TypeScript + Vite                    │
│ TanStack Router                              │
│ TanStack Query                               │
│ Tailwind CSS + shadcn/ui + Radix             │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│                  Backend                     │
│                                              │
│ Express + TypeScript                         │
│ JWT Authentication                            │
│ RBAC Middleware                               │
│ Tenant Middleware                             │
│ Zod Validation                                │
│ Repository → Service → Controller → Routes    │
└──────────────────────┬───────────────────────┘
                       │
                       │ Prisma ORM
                       ▼
┌──────────────────────────────────────────────┐
│                 PostgreSQL                   │
│                                              │
│ Organizations                               │
│ Users / Roles / Permissions                  │
│ Events / Competitions                        │
│ Registrations / Teams                        │
│ Submissions / Evaluations                    │
│ Judges / Mentors / Volunteers                │
│ Attendance / Certificates                    │
│ Audit Logs                                   │
└──────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Radix UI
- React Hook Form
- Zod
- Recharts
- Lucide React
- Framer Motion

## Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Zod
- Helmet
- express-rate-limit
- CORS

## Database

- PostgreSQL
- Prisma ORM

## Development

- Git
- GitHub
- npm
- tsx

---

# 📁 Project Structure

```text
ascent-platform/
│
├── src/
│   ├── components/
│   │   ├── ds/
│   │   ├── layout/
│   │   ├── templates/
│   │   ├── theme/
│   │   └── ui/
│   │
│   ├── modules/
│   │   ├── platform-admin/
│   │   ├── organizations/
│   │   ├── users/
│   │   ├── events/
│   │   ├── competitions/
│   │   ├── registrations/
│   │   ├── teams/
│   │   ├── submissions/
│   │   ├── evaluations/
│   │   ├── judges/
│   │   ├── mentors/
│   │   ├── volunteers/
│   │   ├── attendance/
│   │   ├── certificates/
│   │   ├── badges/
│   │   ├── winners/
│   │   ├── learning/
│   │   ├── community/
│   │   ├── feedback/
│   │   ├── communication/
│   │   ├── ai-validation/
│   │   ├── ai-copilot/
│   │   ├── integrations/
│   │   ├── workflows/
│   │   ├── security/
│   │   └── developer-admin/
│   │
│   ├── routes/
│   ├── hooks/
│   ├── lib/
│   └── styles.css
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── components.json
└── README.md
```

---

# 🔐 Authentication

The platform uses JWT-based authentication.

Authentication flow:

```text
User
 │
 ▼
Login
 │
 ▼
Express Auth API
 │
 ├── Validate credentials
 ├── Verify bcrypt password
 └── Generate JWT
 │
 ▼
Frontend
 │
 ▼
Authenticated API Requests
```

Passwords are never stored as plaintext.

Passwords are hashed using `bcrypt`.

---

# 🛡️ Role-Based Access Control

Ascent uses granular permission-based RBAC.

Example permissions:

```text
events.read
events.create
events.update
events.delete

teams.read
teams.manage

submissions.read
submissions.manage

evaluations.read
evaluations.manage

certificates.read
certificates.issue
certificates.revoke

organization.manage
platform.manage
```

The backend verifies permissions before allowing protected operations.

---

# 🏢 Multi-Tenancy

Ascent is designed as a multi-tenant platform.

Each organization has isolated data.

Requests contain the organization context through:

```http
x-organization-id
```

The request flow is:

```text
JWT Authentication
       ↓
Tenant Resolution
       ↓
RBAC Permission Check
       ↓
Controller
       ↓
Service
       ↓
Repository
       ↓
Prisma
       ↓
PostgreSQL
```

Repositories enforce `organizationId` filtering to prevent cross-organization data access.

---

# 🔒 Security

Security features include:

- JWT authentication
- bcrypt password hashing
- Role-based permissions
- Tenant isolation
- Helmet security headers
- CORS restrictions
- Rate limiting
- Zod request validation
- Audit logging
- Protected API routes
- Sensitive field filtering

Sensitive information such as passwords, tokens and secrets is not returned through API responses or audit metadata.

---

# 🌐 API

Base URL:

```text
http://localhost:3000/api/v1
```

## Health

```http
GET /api/v1/health
```

## Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Organizations

```http
GET    /api/v1/organizations
POST   /api/v1/organizations
GET    /api/v1/organizations/:id
PATCH  /api/v1/organizations/:id
DELETE /api/v1/organizations/:id
```

## Users

```http
GET   /api/v1/users
GET   /api/v1/users/me
GET   /api/v1/users/:id
PATCH /api/v1/users/me
PATCH /api/v1/users/:id
PATCH /api/v1/users/:id/status
```

## Roles & Permissions

```http
GET    /api/v1/roles
GET    /api/v1/roles/:id
POST   /api/v1/roles
PATCH  /api/v1/roles/:id
DELETE /api/v1/roles/:id

GET /api/v1/permissions
```

## Events

```http
GET    /api/v1/events
GET    /api/v1/events/:id
POST   /api/v1/events
PATCH  /api/v1/events/:id
DELETE /api/v1/events/:id
```

## Competitions

```http
GET    /api/v1/competitions
GET    /api/v1/competitions/:id
POST   /api/v1/competitions
PATCH  /api/v1/competitions/:id
DELETE /api/v1/competitions/:id
```

## Registrations

```http
GET    /api/v1/registrations
GET    /api/v1/registrations/:id
POST   /api/v1/registrations
PATCH  /api/v1/registrations/:id
DELETE /api/v1/registrations/:id
```

## Teams

```http
GET    /api/v1/teams
GET    /api/v1/teams/:id
POST   /api/v1/teams
PATCH  /api/v1/teams/:id
DELETE /api/v1/teams/:id
```

## Submissions

```http
GET    /api/v1/submissions
GET    /api/v1/submissions/:id
POST   /api/v1/submissions
PATCH  /api/v1/submissions/:id
DELETE /api/v1/submissions/:id
```

Additional APIs are available for:

```text
Evaluations
Judges
Mentors
Volunteers
Attendance
Certificates
```

---

# 🗄️ Database

Prisma is used as the ORM.

Generate Prisma Client:

```bash
npx prisma generate
```

Create/apply migrations:

```bash
npm run db:migrate
```

Seed development data:

```bash
npm run db:seed
```

Inspect the database using Prisma Studio:

```bash
npx prisma studio
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ascent_db"

JWT_SECRET="your-development-secret"

FRONTEND_URL="http://localhost:8081"

PORT=3000
```

> Never commit real production secrets to GitHub.

Use `.env.example` to document required environment variables.

---

# 🚀 Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd ascent-platform
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npm run db:migrate
```

Seed the database:

```bash
npm run db:seed
```

---

# ▶️ Running the Application

## Start Backend

```bash
npm run dev:server
```

Backend:

```text
http://localhost:3000
```

## Start Frontend

Open another terminal:

```bash
npm run dev
```

Frontend:

```text
http://localhost:8081
```

---

# 👤 Development Credentials

The seed script provides development-only accounts.

### Platform Admin

```text
Email: admin@ascent.dev
Password: password123
```

### Organization Manager

```text
Email: manager@contoso.com
Password: password123
```

### Participant

```text
Email: participant@gmail.com
Password: password123
```

> These credentials are for local development only and must never be used in production.

---

# 🧪 Testing & Verification

TypeScript check:

```bash
npx tsc --noEmit
```

Build:

```bash
npm run build:dev
```

Backend health check:

```text
GET http://localhost:3000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Ascent API is healthy"
}
```

---

# 📊 Integration Status

## ✅ Fully Backend Integrated

- Authentication
- Platform Administration
- Organization Management
- User Management
- Roles & Permissions
- Event Management
- Competition Management
- Registration Management
- Team Management
- Submission Management
- Evaluation Management
- Judge Management
- Mentor Management
- Volunteer Management
- Attendance Management

## 🚧 Progressive Backend Integration

The following modules currently have enterprise UI implementations and are being progressively connected to the real backend:

- Payment & Billing
- AI Validation
- Live Event Management
- Communication Center
- Certificate Management
- Badge & Achievement Management
- Winner Management
- Sponsor Management
- Recruitment Management
- Learning & Resource Center
- Community & Networking
- Feedback Management
- Analytics & BI
- AI Copilot
- Notification Engine
- Reports
- Integration Hub
- Workflow Automation
- Security & Compliance
- Developer Administration

---

# 🔄 Development Roadmap

```text
Phase 1
│
├── UI Foundation
├── Design System
├── Application Shell
└── 35 Module UI Architecture
        │
        ▼
Phase 2
│
├── Modular Architecture
├── Mock Services
├── Reusable Templates
└── Enterprise UI
        │
        ▼
Phase 3
│
├── PostgreSQL
├── Prisma
├── Express API
├── JWT Authentication
├── Multi-Tenancy
├── RBAC
└── Core Event Operations
        │
        ▼
Phase 4
│
├── Certificates
├── Communication
├── Notifications
├── Payments
├── AI Validation
├── Workflow Automation
├── Integrations
└── AI Copilot
        │
        ▼
Phase 5
│
├── Advanced Analytics
├── Enterprise Security
├── Developer Platform
└── Production Deployment
```

---

# 🎨 Design System

The platform uses a reusable enterprise design system built on:

- shadcn/ui
- Radix UI
- Tailwind CSS
- Lucide Icons

Reusable components include:

- Buttons
- Inputs
- Selects
- Dialogs
- Drawers
- Tables
- Pagination
- Cards
- Statistics Cards
- Charts
- Tabs
- Breadcrumbs
- Badges
- Status Chips
- Timelines
- Steppers
- Progress Bars
- File Uploads
- Form Controls
- Page Templates

Page templates include:

```text
ListPageTemplate
DetailsPageTemplate
FormPageTemplate
```

---

# 📐 Backend Architecture

Each backend feature follows:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

### Controller
Handles HTTP requests and responses.

### Service
Contains business logic.

### Repository
Handles database operations and tenant isolation.

### Validator
Validates incoming request data using Zod.

### Middleware
Handles authentication, tenant resolution, RBAC, validation, and security.

---

# 📡 Frontend Data Flow

```text
React Component
      ↓
React Query Hook
      ↓
API Service
      ↓
fetchApi()
      ↓
Express API
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Prisma
      ↓
PostgreSQL
```

This architecture allows mock services to be progressively replaced with real APIs without redesigning the UI.

---

# 🤝 Development Guidelines

When adding a new module:

1. Create the module under `src/modules/`.
2. Keep routing inside `src/routes/`.
3. Keep business UI inside the module.
4. Create a dedicated API service.
5. Use React Query for server state.
6. Use Zod for validation.
7. Reuse existing shadcn components.
8. Reuse existing page templates.
9. Add backend repository/service/controller/routes.
10. Enforce tenant isolation.
11. Add appropriate RBAC permissions.
12. Add audit logging for important mutations.
13. Add seed data for development.
14. Test the API.
15. Test the browser flow.
16. Run TypeScript and build checks.

---

# 🔒 Production Considerations

Before production deployment:

- Replace development JWT secrets.
- Configure production PostgreSQL.
- Configure secure CORS origins.
- Enable HTTPS.
- Configure secure cookies/tokens.
- Configure production rate limits.
- Add proper logging/monitoring.
- Configure backups.
- Review RBAC permissions.
- Perform security testing.
- Remove development credentials.
- Configure CI/CD.
- Add automated tests.
- Configure production environment variables.

---

# 📈 Project Vision

Ascent is designed to become a unified enterprise platform for:

```text
Organizations
      ↓
Events
      ↓
Competitions
      ↓
Registrations
      ↓
Teams
      ↓
Submissions
      ↓
Evaluation
      ↓
Winners
      ↓
Certificates
      ↓
Analytics
      ↓
Recruitment / Innovation
```

The modular architecture allows the platform to expand into AI-powered validation, workflow automation, enterprise integrations, analytics, communication, and innovation management without requiring a fundamental architectural rewrite.

---

# 📄 License

This project is currently maintained as a private development project.

Add your organization's license information here before public distribution.
