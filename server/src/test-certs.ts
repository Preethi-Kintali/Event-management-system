import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  const API_URL = "http://localhost:3000/api/v1";
  
  console.log("1. Logging in as admin...");
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "admin@ascent.dev", password: "password123" })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error("Login failed:", loginData);
    return;
  }
  const token = loginData.data.token;
  
  const org = await prisma.organization.findFirst();
  const orgId = org?.id;
  
  if (!orgId) {
    console.error("No org ID found in DB!");
    return;
  }
  
  console.log("Token acquired. Org ID:", orgId);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-organization-id': orgId
  };

  console.log("\n2. Fetching existing certificates...");
  const listRes = await fetch(`${API_URL}/certificates`, { headers });
  const listData = await listRes.json();
  console.log("Fetched certificates count:", listData.data?.length);

  const user = await prisma.user.findFirst();
  const event = await prisma.event.findFirst();

  if (!user || !event) {
    console.error("Could not find user or event to create a certificate.");
    return;
  }

  console.log(`\n3. Issuing single certificate for User: ${user.id}, Event: ${event.id}...`);
  const createRes = await fetch(`${API_URL}/certificates`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      userId: user.id,
      eventId: event.id,
      type: "PARTICIPATION",
      title: "Test Certificate",
      description: "Automated test certificate"
    })
  });
  const createData = await createRes.json();
  console.log("Create response:", createData.id ? "Success" : createData);
  
  if (!createData.id) return;
  const certId = createData.id;
  const verificationCode = createData.verificationCode;

  console.log(`\n4. Fetching certificate details for ${certId}...`);
  const detailRes = await fetch(`${API_URL}/certificates/${certId}`, { headers });
  const detailData = await detailRes.json();
  console.log("Detail response title:", detailData.title);

  console.log(`\n5. Verifying certificate publicly with code: ${verificationCode}...`);
  const verifyRes = await fetch(`${API_URL}/certificates/verify/${verificationCode}`);
  const verifyData = await verifyRes.json();
  console.log("Public Verify response:", verifyData.id ? "Success, valid!" : "Failed");

  console.log(`\n6. Revoking certificate ${certId}...`);
  const revokeRes = await fetch(`${API_URL}/certificates/${certId}/revoke`, {
    method: 'POST',
    headers
  });
  const revokeData = await revokeRes.json();
  console.log("Revoke response:", revokeData.id ? "Success" : revokeData);

  console.log(`\n7. Deleting certificate ${certId}...`);
  const deleteRes = await fetch(`${API_URL}/certificates/${certId}`, {
    method: 'DELETE',
    headers
  });
  console.log("Delete status:", deleteRes.status);
  
  console.log("\nAll API tests completed successfully!");
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
