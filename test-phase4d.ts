import { PrismaClient } from "@prisma/client";

const BASE_URL = "http://localhost:3000/api/v1";
const ADMIN_CREDENTIALS = { email: "admin@ascent.dev", password: "password123" };

async function runTests() {
  console.log("=== Phase 4D API E2E Verification ===");

  const prisma = new PrismaClient();
  const org = await prisma.organization.findFirst({ where: { slug: "contoso-labs" } });
  if (!org) throw new Error("Org not found");
  const TENANT_ID = org.id;
  await prisma.$disconnect();

  // 1. Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ADMIN_CREDENTIALS)
  });
  const loginData: any = await loginRes.json();
  
  if (!loginData.success) {
    console.error("❌ Login failed:", loginData);
    process.exit(1);
  }
  
  const token = loginData.data.token;
  
  const headers = {
    "Authorization": `Bearer ${token}`,
    "x-organization-id": TENANT_ID,
    "Content-Type": "application/json"
  };

  console.log("✅ Logged in successfully");

  // 2. Test Feedback API
  console.log("\n--- Testing Feedback API ---");
  const feedbackRes = await fetch(`${BASE_URL}/feedback/responses`, { headers });
  const feedbackData: any = await feedbackRes.json();
  if (feedbackData.success) {
    console.log(`✅ Fetched ${feedbackData.data.length} feedback responses`);
  } else {
    console.error("❌ Failed to fetch feedback responses:", feedbackData);
  }

  // Pick first response if any to test getById
  if (feedbackData.data && feedbackData.data.length > 0) {
    const id = feedbackData.data[0].id;
    const singleRes = await fetch(`${BASE_URL}/feedback/responses/${id}`, { headers });
    const singleData: any = await singleRes.json();
    if (singleData.success) {
      console.log(`✅ Fetched single feedback response successfully`);
    } else {
      console.error("❌ Failed to fetch single feedback response:", singleData);
    }
  }

  console.log("\n=== All Tests Completed ===");
}

runTests().catch(console.error);
