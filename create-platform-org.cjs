const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.organization.upsert({
    where: { id: 'PLATFORM' },
    update: {},
    create: {
      id: 'PLATFORM',
      name: 'Platform Admin',
      slug: 'platform-admin',
      status: 'ACTIVE'
    }
  });
  console.log('done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
