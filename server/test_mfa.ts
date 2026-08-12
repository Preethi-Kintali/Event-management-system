import { PrismaClient } from '@prisma/client';

import speakeasy from 'speakeasy';
const p = new PrismaClient();

async function run() {
  const admin = await p.user.findUnique({ where: { email: 'admin@ascent.dev' } });
  const org = await p.organization.findFirst();
  
  // 2. Clear user MFA
  await p.userMfa.deleteMany({ where: { userId: admin.id } });

  // 3. Login normally
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ascent.dev', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;

  // 4. Hit a tenant endpoint (should get 403 MFA_REQUIRED_FOR_TENANT)
  const dashboardRes = await fetch('http://localhost:3000/api/v1/security/dashboard', {
    headers: { 'Authorization': `Bearer ${token}`, 'x-organization-id': org.id }
  });
  console.log('Dashboard Response without MFA:', (await dashboardRes.json()).error?.code);

  // 5. Setup MFA
  const setupRes = await fetch('http://localhost:3000/api/v1/security/mfa/setup', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'x-organization-id': org.id }
  });
  const setupData = await setupRes.json();
  console.log('Setup MFA response:', setupData);

  // 6. Verify MFA
  const code = speakeasy.totp({ secret: setupData.data.secret, encoding: 'base32' });
  const verifyRes = await fetch('http://localhost:3000/api/v1/security/mfa/verify-setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-organization-id': org.id },
    body: JSON.stringify({ code })
  });
  const verifyData = await verifyRes.json();
  console.log('Verify MFA response:', !!verifyData.data?.recoveryCodes);

  // 7. Hit dashboard again
  const dashboardRes2 = await fetch('http://localhost:3000/api/v1/security/dashboard', {
    headers: { 'Authorization': `Bearer ${token}`, 'x-organization-id': org.id }
  });
  console.log('Dashboard Response with MFA:', (await dashboardRes2.json()).success);
  
  // 8. Test next login requires MFA
  const login2Res = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ascent.dev', password: 'password123' })
  });
  const login2Data = await login2Res.json();
  console.log('Login 2 response:', login2Data);
  
  const challengeCode = speakeasy.totp({ secret: setupData.data.secret, encoding: 'base32' });
  const verifyChallengeRes = await fetch('http://localhost:3000/api/v1/auth/mfa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeToken: login2Data.data.challengeToken, code: challengeCode })
  });
  const verifyChallengeData = await verifyChallengeRes.json();
  console.log('Verify Challenge token exists:', !!verifyChallengeData.data.token);

  console.log('Tests complete');
  process.exit(0);
}
run();
