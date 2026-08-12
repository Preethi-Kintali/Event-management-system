import { PrismaClient } from "@prisma/client";

const BASE_URL = "http://localhost:3000/api/v1";
const ADMIN_CREDENTIALS = { email: "manager@contoso.com", password: "password123" };

async function runTests() {
  console.log("=== Phase 4C API E2E Verification ===");

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

  // 2. Test Winners API
  console.log("\n--- Testing Winners API ---");
  const winnersRes = await fetch(`${BASE_URL}/winners`, { headers });
  const winnersData: any = await winnersRes.json();
  if (winnersData.success) {
    console.log(`✅ Fetched ${winnersData.data.length} winners`);
  } else {
    console.error("❌ Failed to fetch winners:", winnersData);
  }

  const prizesRes = await fetch(`${BASE_URL}/winners/prizes`, { headers });
  const prizesData: any = await prizesRes.json();
  if (prizesData.success) {
    console.log(`✅ Fetched ${prizesData.data.length} prizes`);
  } else {
    console.error("❌ Failed to fetch prizes:", prizesData);
  }

  // 3. Test Badges API
  console.log("\n--- Testing Badges API ---");
  const badgesRes = await fetch(`${BASE_URL}/badges`, { headers });
  const badgesData: any = await badgesRes.json();
  if (badgesData.success) {
    console.log(`✅ Fetched ${badgesData.data.length} badges`);
  } else {
    console.error("❌ Failed to fetch badges:", badgesData);
  }

  const achievementsRes = await fetch(`${BASE_URL}/badges/achievements`, { headers });
  const achievementsData: any = await achievementsRes.json();
  if (achievementsData.success) {
    console.log(`✅ Fetched ${achievementsData.data.length} achievements`);
  } else {
    console.error("❌ Failed to fetch achievements:", achievementsData);
  }

  console.log("\n=== All Tests Completed ===");
}

runTests().catch(console.error);
