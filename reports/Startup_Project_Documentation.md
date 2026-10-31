# Eventura Platform (Eventura) — Startup Project Documentation
**Document Version**: v2.0  
**Project Version**: v1.2.0 (Production Handover)  
**Prepared By**: Lead Systems Architect & Core Engineering Team  
**Last Updated**: October 30, 2026  
**Status**: Production Verified & Active Staging Ready  

---

## 1. Cover Page Details
* **Project Name**: Eventura Platform (Eventura Enterprise)
* **Version**: v1.2.0
* **Document Version**: v2.0
* **Prepared By**: Lead Systems Architect & Core Engineering Team
* **Last Updated**: October 30, 2026

## 2. Project Summary
* **Purpose**: Eventura is an enterprise multi-tenant event, competition, hackathon, and innovation operating system for colleges, universities, and tech communities.
* **Problem Solved**: Replaces chaotic Google Forms, paper budget approvals, spreadsheet judging, and unverifiable paper certificates with a unified digital workflow.
* **Intended Users**: Institutional Admins, Event Managers, Student Coordinators, Judges, Hackers, Mentors, and Volunteers.
* **Current Status**: Production Handover & Active Staging Ready.

## 3. Business Context
* **Why Built**: Collegiate tech symposiums involve high stakes, multi-track challenges, and significant budgets, but suffered from bureaucratic delays and lack of audit trails.
* **Expected Value**: 85% reduction in reporting turnaround, 100% elimination of certificate fraud, and sub-second gate check-ins.

## 4. System Overview
Eventura follows a 4-tier full-stack architecture with strict multi-tenant data isolation:
* **Client Tier**: React 19, TypeScript, TanStack Start, TanStack Router, Tailwind CSS v4, Radix UI.
* **Security Perimeter**: Helmet, Rate Limiter, CORS, JWT Guard, Tenant Resolver, RBAC Engine.
* **Domain Layer**: Event, Competition, Team, Submission, Rubric Scoring, Certificate, Attendance, Gemini AI, Stripe Services.
* **Persistence Layer**: PostgreSQL 16 managed via Prisma ORM 5.22.

## 5. Technology Stack
* **Frontend**: React 19, TypeScript 5.8, Vite 8.2, TanStack Start & Router, TanStack Query v5, Tailwind CSS v4, Radix UI, Recharts, Lucide Icons.
* **Backend**: Node.js 22 LTS, Express 5.2, TypeScript, Zod 3.24, bcrypt 6.0, jsonwebtoken 9.0, Helmet 8.3, express-rate-limit 8.6, PDFKit.
* **Database & ORM**: PostgreSQL 16, Prisma ORM 5.22.
* **AI & External**: Google Gemini 3.6 Flash, Stripe API & Webhooks, HTML5 Camera QR Engine.

## 6. Major Modules
1. **Tenant & Organization Governance**: Multi-tenant isolation and domain settings.
2. **Identity, Auth & RBAC**: JWT security and granular permissions.
3. **Event Proposal & Approval Chain**: 3-tier formal institutional approval workflow.
4. **Competitions & Tracks**: Challenge descriptions and team limits.
5. **Team Registration & Roster Lock**: Anti-fraud team locking.
6. **Submission & Artifact Hub**: Code, slide deck, and video deliverables.
7. **Rubric Evaluation Engine**: Digital scorecards with score normalization.
8. **QR Attendance Gate Scanner**: Sub-second mobile camera check-in.
9. **Tamper-Proof Certificates**: SHA-256 verifiable credentials with public QR codes.
10. **Gemini AI Dossier**: Auto-synthesized executive event dossiers.

## 7. System Workflow
1. Proposal Submission &rarr; 2. Manager Endorsement &rarr; 3. Principal Formal Sanction &rarr; 4. Track & Rubric Config &rarr; 5. Team Formation & Registration &rarr; 6. Day-of-Event QR Gate Pass Check-in &rarr; 7. Project Submissions & Timer Freeze &rarr; 8. Judge Scoring & Normalization &rarr; 9. Winner Declaration &rarr; 10. Automated AI Dossier & Verifiable Certificate Issuance.

## 8. Data Model
Core entities: Organization, User, UserMembership, Role, Permission, Event, Competition, Registration, Team, Submission, Evaluation, Certificate, AttendanceSession, AttendanceRecord, Payment, AuditLog.

## 9. External Integrations
Google Gemini AI, Stripe Payments, HTML5 QR Engine, PDFKit, AWS S3 / Local Storage.

## 10. Configuration
Environment variables: PORT, NODE_ENV, API_URL, VITE_API_URL, FRONTEND_URL, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, STORAGE_PROVIDER, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GEMINI_MODEL.

## 11. Deployment Overview
* Development: Local Node.js + tsx + PostgreSQL.
* Staging: Containerized Docker stack with automated testing.
* Production: High-availability Cloud VPC, edge CDN, clustered Express nodes, multi-AZ PostgreSQL.

## 12. Project Structure
Organized into server (controllers, services, repositories, routes), src (modules, components, lib, router), prisma, and scripts.

## 13. Known Limitations
Single-process Express ceiling (~2,500 req/sec), Prisma connection pool limits, local file storage defaults, and polling-based leaderboards.

## 14. Maintenance Notes
Scheduled registration cleanup jobs, automated pg_dump backups with WAL archiving, structured JSON logging, and troubleshooting workflows.

## 15. Changelog
* v1.2.0 (Oct 30, 2026): Production Handover, Gemini AI Dossier, PDF generation.
* v1.1.0 (Oct 28, 2026): QR gate scanner, Stripe payments, normalized scoring.
* v1.0.0 (Oct 20, 2026): Core multi-tenant architecture and event workflows.

## 16. References & Separate Companion Documents
1. API Documentation (`reports/05_Database_and_API_Documentation.pdf`)
2. Database Schema (`prisma/schema.prisma`)
3. Deployment & Setup Guide (`reports/03_Project_Setup_Guide.pdf`)
4. Testing Report (`reports/06_Testing_Report.pdf`)
5. Developer Onboarding Guide (`reports/04_Technical_Documentation.pdf`)
6. User Manual (`PR/02-REQUIREMENTS-SPECIFICATION.md`)
7. Complete UML 2.5 Specification (`reports/Eventora_Complete_UML_Architecture_Diagrams.pdf`)
