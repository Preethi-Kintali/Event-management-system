import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

async function generateToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

async function run() {
  console.log("Setting up tests...");
  const adminToken = await generateToken("admin@ascent.dev");
  const participantToken = await generateToken("bob@gmail.com");

  const orgs = await prisma.organization.findMany();
  const org1 = orgs[0].id;
  const org2 = orgs.length > 1 ? orgs[1].id : "fake_org_id";

  async function test(name: string, url: string, token: string | null, orgId: string | null) {
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (orgId) headers["x-organization-id"] = orgId;

    try {
      const res = await fetch(`http://localhost:3000${url}`, { headers });
      const text = await res.text();
      let status = res.status;
      console.log(`[${name}] -> HTTP ${status} | ` + text.slice(0, 100).replace(/\n/g, ''));
    } catch (e: any) {
      console.log(`[${name}] -> ERROR | ${e.message}`);
    }
  }

  // A. No authentication
  await test("A. No authentication", "/api/v1/reports/events", null, org1);

  // B. Missing x-organization-id
  await test("B. Missing x-organization-id", "/api/v1/reports/events", adminToken, null);

  // C. Wrong organization ID
  await test("C. Wrong organization ID", "/api/v1/reports/events", participantToken, org2);

  // D. User without reports.read
  // Participant doesn't have reports.read
  await test("D. User without reports.read", "/api/v1/reports/events", participantToken, org1);

  // E. User with reports.read but without reports.export
  // I need to create a token for a user that has read but not export, or just test participant exporting.
  await test("E. Participant exporting", "/api/v1/reports/events/export?format=csv", participantToken, org1);

  // F. Invalid report type
  await test("F. Invalid report type", "/api/v1/reports/invalidtype/export?format=csv", adminToken, org1);

  // G. Invalid export format
  await test("G. Invalid export format", "/api/v1/reports/events/export?format=pdf", adminToken, org1);
}

run().catch(console.error).finally(() => process.exit(0));
