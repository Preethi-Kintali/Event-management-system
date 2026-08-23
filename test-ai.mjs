import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  console.log('GEMINI_API_KEY configured:', !!process.env.GEMINI_API_KEY);
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ include: { memberships: { include: { organization: true, role: true } } } });
  if (!user) return console.log('No user');
  const org = user.memberships[0].organization;
  const role = user.memberships[0].role;
  
  // Ensure permission exists in DB
  let perm = await prisma.permission.findUnique({ where: { action: 'ai_copilot.use' } });
  if (!perm) {
    perm = await prisma.permission.create({ data: { action: 'ai_copilot.use', description: 'Use AI Copilot' } });
  }
  // Grant to role if missing
  const rolePerm = await prisma.rolePermission.findFirst({ where: { roleId: role.id, permissionId: perm.id } });
  if (!rolePerm) {
    await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'replace-with-secure-secret', { expiresIn: '1h' });
  try {
    const res = await fetch('http://localhost:3000/api/v1/ai-copilot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'x-organization-id': org.id },
      body: JSON.stringify({ message: 'Give me a short summary of the platform purpose in exactly one sentence.' })
    });
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', await res.json());
    
    // Verify DB logging
    const aiLog = await prisma.aIRequest.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log('LATEST AI REQUEST DB LOG:', aiLog);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  await prisma.$disconnect();
}
run();
