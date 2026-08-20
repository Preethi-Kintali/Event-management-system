import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const transactions = await prisma.payment.findMany({
    where: {
      type: "EVENT_REGISTRATION",
      user: {
        memberships: {
          none: {
            role: {
              name: { in: ["Platform Admin", "Organization Admin"] }
            }
          }
        }
      }
    },
    include: { user: true }
  });
  console.log("Filtered transactions count:", transactions.length);
  
  const all = await prisma.payment.findMany({ where: { type: "EVENT_REGISTRATION" }});
  console.log("All transactions count:", all.length);
}
main();
