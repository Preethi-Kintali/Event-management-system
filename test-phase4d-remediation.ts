import { PrismaClient } from "@prisma/client";

const BASE_URL = "http://localhost:3000/api/v1";
const prisma = new PrismaClient();

// Simple test script to verify that the dashboard APIs return 200 OK
async function runTests() {
  console.log("Starting Phase 4D Dashboard API Tests...");
  
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "manager@contoso.com",
        password: "password123"
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    const user = loginData.data.user;
    console.log("Logged in successfully.");

    const dbUser = await prisma.user.findUnique({
      where: { email: "manager@contoso.com" },
      include: { memberships: true }
    });
    const orgId = dbUser?.memberships[0].organizationId;
    const roleId = dbUser?.memberships[0].roleId;

    // Give role the required permissions
    const permissionsToAdd = [
      "recruitment.read",
      "sponsors.read",
      "learning.read",
      "community.read",
      "feedback.read"
    ];

    for (const action of permissionsToAdd) {
      let perm = await prisma.permission.findUnique({ where: { action } });
      if (!perm) {
        perm = await prisma.permission.create({ data: { action, module: "Phase4D" } });
      }
      
      const existing = await prisma.rolePermission.findUnique({
        where: { roleId_permissionId: { roleId, permissionId: perm.id } }
      });
      if (!existing) {
        await prisma.rolePermission.create({
          data: { roleId, permissionId: perm.id }
        });
      }
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
      "x-organization-id": orgId 
    };
    
    console.log("Using org ID:", headers["x-organization-id"]);

    const endpoints = [
      "/recruitment/dashboard",
      "/sponsors/dashboard",
      "/learning/dashboard",
      "/community/dashboard",
      "/feedback/dashboard"
    ];

    let passed = 0;
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
        const data = await res.json();
        if (res.status === 200 && data.success) {
          console.log(`✅ [PASS] GET ${endpoint}`);
          passed++;
        } else {
          console.log(`❌ [FAIL] GET ${endpoint} - Unexpected response format: ${JSON.stringify(data)}`);
        }
      } catch (err: any) {
        console.log(`❌ [FAIL] GET ${endpoint} - ${err.message}`);
      }
    }
    
    console.log(`\nResults: ${passed}/${endpoints.length} passed.`);
  } catch (err: any) {
    console.log("Failed to login or run tests:", err.message);
  }
}

runTests();
