import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Reports RBAC synchronization...");

  const reportPermissions = [
    { action: "reports.read", description: "Allows viewing dashboards and reports" },
    { action: "reports.export", description: "Allows exporting report data to CSV/Excel" },
  ];

  for (const perm of reportPermissions) {
    const upserted = await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
    console.log(`Verified permission: ${upserted.action} (${upserted.id})`);
  }

  const allPerms = await prisma.permission.findMany({
    where: { action: { in: reportPermissions.map(p => p.action) } }
  });

  const targetRoles = await prisma.role.findMany({
    where: {
      name: { in: ["Sudo Admin", "Admin", "Organization Admin", "Platform Admin", "Manager"] }
    }
  });

  for (const role of targetRoles) {
    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id
        }
      });
    }
    console.log(`Synced reports permissions for role: ${role.name} (${role.id})`);
  }

  console.log("Reports RBAC sync completed successfully.");
}

main()
  .catch((e) => {
    console.error("Reports permission sync failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
