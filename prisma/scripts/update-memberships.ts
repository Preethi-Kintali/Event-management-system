import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  await prisma.organizationMember.updateMany({ data: { status: 'ACTIVE' } });
  console.log('Updated all memberships to ACTIVE');
}
check().finally(() => prisma.$disconnect());
