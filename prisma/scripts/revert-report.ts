import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const eventId = "e26603b2-c2e4-4e05-8b4a-0e70918a0c5d";
  await prisma.eventFinalReport.update({
    where: { eventId },
    data: { status: 'AI_GENERATED' }
  });
  console.log("Status reverted to AI_GENERATED");
}

main().catch(console.error).finally(() => prisma.$disconnect());
