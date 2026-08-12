import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const API_BASE = "http://localhost:3000/api/v1";

const endpoints = [
  "/analytics/participation",
  "/analytics/revenue",
  "/analytics/feedback",
  "/analytics/attendance",
  "/analytics/certificates",
  "/analytics/evaluations",
  "/analytics/sponsors",
  "/analytics/recruitment",
  "/analytics/ai",
];

async function generateToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret_dev_jwt_key_12345", { expiresIn: "1h" });
}

async function runAudit() {
  console.log("=== Phase 5 Analytics Audit ===");
  
  const org1 = await prisma.organization.findFirst();
  if (!org1) throw new Error("No organization found");

  const org2 = await prisma.organization.findFirst({ where: { id: { not: org1.id } } });

  // Get a user who is an admin in org1
  const userRole = await prisma.organizationMember.findFirst({
    where: { organizationId: org1.id, role: { name: "Organization Admin" } },
    include: { user: true },
  });
  if (!userRole) throw new Error("No admin user found for org1");
  
  // Ensure this role has the analytics.read permission
  let perm = await prisma.permission.findUnique({ where: { action: "analytics.read" } });
  if (!perm) {
    perm = await prisma.permission.create({ data: { action: "analytics.read", description: "Read analytics" } });
  }
  
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: userRole.roleId, permissionId: perm.id } },
    update: {},
    create: { roleId: userRole.roleId, permissionId: perm.id }
  });

  const token = await generateToken(userRole.userId);

  // Get a user who is a participant (no analytics.read)
  const participantRole = await prisma.organizationMember.findFirst({
    where: { organizationId: org1.id, role: { permissions: { none: { permission: { action: "analytics.read" } } } } },
    include: { user: true }
  });
  const participantToken = participantRole ? await generateToken(participantRole.userId) : null;

  const results: any[] = [];

  for (const endpoint of endpoints) {
    const res: any = { endpoint };

    // 1. Unauthenticated -> 401
    const r1 = await fetch(`${API_BASE}${endpoint}`);
    res["401_Unauth"] = r1.status === 401 ? "PASS" : `FAIL (${r1.status})`;

    // 2. Missing Tenant -> 400
    const r2 = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res["400_NoTenant"] = r2.status === 400 ? "PASS" : `FAIL (${r2.status})`;

    // 3. No Permission -> 403
    if (participantToken) {
      const r3 = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${participantToken}`, "x-organization-id": org1.id }
      });
      res["403_NoPerm"] = r3.status === 403 ? "PASS" : `FAIL (${r3.status})`;
    } else {
      res["403_NoPerm"] = "SKIP";
    }

    // 4. Valid Request -> 200
    const r4 = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}`, "x-organization-id": org1.id }
    });
    res["200_Valid"] = r4.status === 200 ? "PASS" : `FAIL (${r4.status})`;
    if (r4.status === 200) {
      const data = await r4.json();
      res["has_data"] = data && data.kpis ? "YES" : "NO";
    }

    results.push(res);
    await new Promise(r => setTimeout(r, 100)); // Rate limit bypass
  }

  console.table(results);
}

runAudit().catch(console.error).finally(() => prisma.$disconnect());
