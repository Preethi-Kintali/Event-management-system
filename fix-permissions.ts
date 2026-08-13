import { prisma } from "./server/src/utils/prisma";

async function run() {
  const perms = ["analytics.read"];
  
  for (const action of perms) {
    await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action, description: `Permission for ${action}` },
    });
  }
  
  const permIds = await prisma.permission.findMany({
    where: { action: { in: perms } },
    select: { id: true },
  });

  const adminRoles = await prisma.role.findMany({
    where: { name: "Admin" },
  });

  for (const role of adminRoles) {
    for (const p of permIds) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: p.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: p.id,
        },
      });
    }
  }
  console.log("Analytics permission granted to Admin roles.");
}

run().catch(console.error).finally(() => prisma.$disconnect());
