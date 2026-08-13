import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  try {
    const tenantId = "dummy";
    const mtdPayments = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          organizationId: tenantId,
          status: "SUCCEEDED",
          createdAt: { gte: new Date() },
        },
      });
    console.log("MTD:", mtdPayments);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test().finally(() => prisma.$disconnect());
