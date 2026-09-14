import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const fc = await prisma.user.findUnique({
    where: { email: 'faculty1@contoso.com' },
    include: { memberships: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
  });
  console.log(JSON.stringify(fc?.memberships[0].role.permissions.map(p => p.permission.action), null, 2));
}
check().finally(() => prisma.$disconnect());
