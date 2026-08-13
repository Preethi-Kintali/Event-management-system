const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const part = await prisma.user.findUnique({
    where: {email: 'participant@gmail.com'},
    include: {memberships: {include: {role: true}}}
  });
  console.log('Participant:', JSON.stringify(part, null, 2));

  const mgr = await prisma.user.findUnique({
    where: {email: 'manager@contoso.com'},
    include: {memberships: {include: {role: true}}}
  });
  console.log('Manager:', JSON.stringify(mgr, null, 2));
}

main().finally(() => prisma.$disconnect());
