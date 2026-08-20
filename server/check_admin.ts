import { prisma } from "./src/utils/prisma";

async function check() {
  const admin = await prisma.user.findFirst({
    where: { firstName: { contains: "Admin" } },
    include: {
      memberships: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      }
    }
  });

  console.dir(admin, { depth: null });
}
check().catch(console.error).finally(() => prisma.$disconnect());
