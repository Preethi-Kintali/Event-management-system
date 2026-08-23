import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ include: { memberships: { include: { organization: true, role: true } } } });
  if (!user) return console.log('No user');
  
  const org = user.memberships[0].organization;
  const role = user.memberships[0].role;
  
  // Ensure permission exists in DB and grant it
  let perm = await prisma.permission.findUnique({ where: { action: 'ai_copilot.use' } });
  if (!perm) perm = await prisma.permission.create({ data: { action: 'ai_copilot.use', description: 'Use AI Copilot' } });
  
  const rolePerm = await prisma.rolePermission.findFirst({ where: { roleId: role.id, permissionId: perm.id } });
  if (!rolePerm) await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'replace-with-secure-secret', { expiresIn: '1h' });
  
  console.log("Testing Event Rules Generator...");
  try {
    const res = await fetch('http://localhost:3000/api/v1/ai-copilot/generate/event-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'x-organization-id': org.id },
      body: JSON.stringify({ 
        eventName: 'NextGen Design Summit',
        category: 'Design Challenge',
        teamSize: '2-4 members',
        eligibility: 'All college students',
        duration: '7 days',
        submissionType: 'Figma prototype and Pitch deck',
        additionalInstructions: 'Focus on accessibility and inclusive design.'
      })
    });
    console.log('STATUS:', res.status);
    const result = await res.json();
    console.log('RESPONSE:', result);
    
    // Verify DB logging
    const aiLog = await prisma.aIRequest.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log('LATEST AI REQUEST DB LOG:', aiLog);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  
  // Security Test 2: Unauthenticated
  try {
    const res2 = await fetch('http://localhost:3000/api/v1/ai-copilot/generate/event-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // No auth, no x-organization-id
      body: JSON.stringify({ eventName: 'Test' })
    });
    console.log('SECURITY TEST (Unauthenticated) STATUS:', res2.status);
  } catch(e) {}
  
  await prisma.$disconnect();
}
run();
