# PRODUCTION DEPLOYMENT CHECKLIST & RUNBOOK
**Eventora powered by Clientura — Enterprise Event & Hackathon Platform**

---

## 1. Required Production Environment Variables

> [!IMPORTANT]
> Verify that all following environment variable names are provisioned in your production hosting secrets store (e.g., AWS Secrets Manager, Vercel/Cloudflare Env, Kubernetes Secrets). **Never commit actual credential values into version control.**

### Backend & Core
- `NODE_ENV` (`production`)
- `PORT` (e.g. `3000` or assigned by platform)
- `DATABASE_URL` (PostgreSQL connection string with pooling if applicable)
- `JWT_SECRET` (High-entropy secret key for access token signing)
- `JWT_REFRESH_SECRET` (High-entropy secret key for refresh token signing)
- `FRONTEND_URL` (FQDN of the frontend application, e.g., `https://eventora.yourdomain.com`)

### Optional & Integration Services
- `STRIPE_SECRET_KEY` (Stripe live API secret key)
- `STRIPE_WEBHOOK_SECRET` (Stripe endpoint signing secret)
- `GEMINI_API_KEY` (Google Gemini generative AI key for AI-assisted evaluations)
- `REDIS_URL` (Redis connection string for rate limiting / caching)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (Transactional email service)
- `STORAGE_BUCKET_URL` / `S3_BUCKET` (Object storage for persistent document/certificate uploads)

---

## 2. Database Backup & Migration Procedures

### Step 1: Pre-Deployment Full Backup
Before executing any deployment or schema updates, create a point-in-time snapshot of the production PostgreSQL database:
```bash
# Dump compressed PostgreSQL database snapshot
pg_dump -h <DB_HOST> -U <DB_USER> -d <DB_NAME> -F c -b -v -f ./pre_deploy_backup_$(date +%Y%m%d_%H%M%S).dump
```

### Step 2: Forward-Only Safe Migration
Apply existing forward-only migrations. Never run destructive reset commands in production.
```bash
# Apply pending forward migrations
npx prisma migrate deploy

# Verify Prisma client is generated
npx prisma generate
```

### Step 3: Seed / Sync Critical Permissions (Idempotent)
Run the idempotent RBAC permissions sync script to ensure newly introduced permissions (such as `reports.read` and `reports.export`) are populated across all administrative and manager roles:
```bash
npx tsx prisma/scripts/sync-reports-permissions.ts
```

---

## 3. Verified Build & Production Start Commands

### Frontend / Fullstack SSR (TanStack Start + Nitro)
- **Production Build Command**:
  ```bash
  npm run build
  ```
  *Output: `.output/server/index.mjs` and `.output/public/`*
- **Production Start Command**:
  ```bash
  node .output/server/index.mjs
  ```
  *(Or configure PM2 / systemd / Docker container entrypoint to run `node .output/server/index.mjs`)*

### Backend API Server (Express + Prisma)
- **Production Start Command**:
  ```bash
  npm run server
  ```
  *(Executes `tsx server/src/index.ts` or pre-transpiled Node bundle depending on hosting configuration)*

---

## 4. Required Third-Party Services & Integrations

1. **PostgreSQL 15+**:
   - Primary multi-tenant relational store.
   - Requires persistent disk storage with automatic daily WAL archiving.
2. **Stripe (Live Mode)**:
   - Webhook endpoint configured at `https://<API_DOMAIN>/api/v1/payments/webhook`.
   - Event subscriptions: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`.
3. **Google Gemini / AI Provider**:
   - Required for automated proposal classification, AI mentor responses, and smart summary generation.
4. **Persistent File Storage (Local disk or S3/Blob storage)**:
   - Storage directory for submission uploads and generated certificates. Must be mapped to persistent volume storage on Docker/Kubernetes.

---

## 5. Hosting & Network Configuration

- **Reverse Proxy**: NGINX, Cloudflare, or AWS ALB terminating TLS/HTTPS.
- **SSL / TLS**: Enforce HTTPS with HTTP-to-HTTPS 301 redirection.
- **Port Bindings**:
  - Backend API: default `3000` (or `PORT` env var).
  - Frontend SSR Server: default `8080` (or `PORT` env var).
- **CORS Setup**: Ensure `FRONTEND_URL` in `.env` matches the public HTTPS frontend domain so pre-flight CORS headers (`Access-Control-Allow-Origin`) succeed.
- **Rate Limiting**: Rate limiter is active in `server/src/app.ts` (`express-rate-limit`). For high-throughput events, adjust thresholds or configure Redis store.

---

## 6. Step-by-Step Deployment Sequence

1. **Maintenance Window Announcement** (if migrating large schemas).
2. **Database Snapshot**: Take snapshot/backup using `pg_dump`.
3. **Deploy Database Schema**: Run `npx prisma migrate deploy` and `npx tsx prisma/scripts/sync-reports-permissions.ts`.
4. **Deploy Backend Service**:
   - Pull latest commit.
   - Install production dependencies (`npm ci --omit=dev`).
   - Run `npx prisma generate`.
   - Start backend daemon (`npm run server`).
   - Validate health endpoint: `GET /api/v1/health` -> HTTP 200 `{"success": true}`.
5. **Deploy Frontend Service**:
   - Run `npm run build`.
   - Start Nitro SSR server (`node .output/server/index.mjs`).
   - Verify index route: `GET /` -> HTTP 200.
6. **Execute Post-Deployment Smoke Tests** (see Section 7).
7. **Switch Traffic**: Direct DNS / load balancer to new container/service.

---

## 7. Post-Deployment Smoke Verification

Execute the following verification checklist immediately after deployment:

- [ ] **API Health Check**:
  ```bash
  curl -i https://<API_DOMAIN>/api/v1/health
  # Expected: HTTP 200 OK, {"success": true, "message": "Eventora API is healthy"}
  ```
- [ ] **Automated Smoke Test Suite**:
  ```bash
  npm run test:smoke
  # Expected: Total Checks: 10 | Passed: 10 | Failed: 0
  ```
- [ ] **Public Signup Check**:
  - Visit `https://<FRONTEND_DOMAIN>/signup`.
  - Confirm role selection displays only **Participant**.
  - Create a test participant account and verify redirect to `/login`.
- [ ] **Authentication & MFA**:
  - Log in as administrative user.
  - Verify JWT token issuance and proper MFA prompt for accounts with TOTP configured.
- [ ] **Multi-Tenant Scoping**:
  - Send request to `GET /api/v1/events` without `x-organization-id` header -> verify HTTP 400 `MISSING_TENANT`.
- [ ] **Submission File View Endpoint**:
  - Open an existing team submission file -> verify inline rendering in browser without 404.
- [ ] **Reports Dashboard**:
  - Visit `/reports` as Admin/Manager -> verify HTTP 200 and analytics KPI rendering.

---

## 8. Rollback Plan

If a critical failure occurs during deployment:

1. **Traffic Reversion**:
   - Immediately switch load balancer / CDN DNS traffic back to the previous stable release container/instance.
2. **Database Rollback (if schema change failed)**:
   - Stop backend service.
   - Restore database from pre-deployment snapshot:
     ```bash
     pg_restore -h <DB_HOST> -U <DB_USER> -d <DB_NAME> -c -v ./pre_deploy_backup_<TIMESTAMP>.dump
     ```
3. **Application Rollback**:
   - Re-deploy previous stable container image or git commit.
   - Run `npm run build` and restart services.
4. **Post-Rollback Health Check**:
   - Confirm `GET /api/v1/health` returns HTTP 200.

---

## 9. Remaining Manual Tasks Before Go-Live

- [ ] Set up production Stripe webhook signing endpoint and test with a $1 test mode checkout.
- [ ] Configure live SMTP credentials for outbound participant invitation emails.
- [ ] Configure persistent storage mount for uploaded submission documents and generated PDF certificates.
- [ ] Set up automated uptime monitoring (e.g. BetterStack, Datadog, Pingdom) pointing to `/api/v1/health`.
