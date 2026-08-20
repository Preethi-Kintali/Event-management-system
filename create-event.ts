import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findFirst({
    include: { members: { include: { user: true } } }
  });
  
  if (!org) {
    console.log("No organization found");
    return;
  }
  
  const event = await prisma.event.create({
    data: {
      organizationId: org.id,
      name: "Premium Tech Conference 2026",
      description: "A premium paid event.",
      status: "PUBLISHED",
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 172800000),
      price: 500,
      currency: "INR"
    }
  });
  
  console.log("Created Paid Event:", event);
}

main().catch(console.error).finally(() => prisma.$disconnect());
