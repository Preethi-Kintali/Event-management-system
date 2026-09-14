import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting permission synchronization...");

  const permissionName = "events.complete";
  const targetRoles = ["Organization Admin", "Platform Admin", "Manager"];

  // Step 1: Ensure permission exists
  const permission = await prisma.permission.upsert({
    where: { action: permissionName },
    update: {},
    create: {
      action: permissionName,
      description: `Allows ${permissionName}`,
    },
  });

  console.log(`Verified permission: ${permission.action} (ID: ${permission.id})`);

  // Get the first organization as fallback for new roles
  const firstOrg = await prisma.organization.findFirst();

  // Step 2: Ensure it is assigned to target roles
  for (const roleName of targetRoles) {
    let role = await prisma.role.findFirst({
      where: { name: roleName },
    });

    if (!role && firstOrg) {
      console.log(`Role '${roleName}' not found. Creating it...`);
      role = await prisma.role.create({
        data: {
          name: roleName,
          organizationId: roleName === "Platform Admin" ? null : firstOrg.id,
          description: `Automatically created ${roleName} role`,
        }
      });
    }

    if (role) {
      // Upsert RolePermission mapping safely
      const rolePermission = await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
      console.log(`Synchronized permission for role: ${roleName}`);
    } else {
      console.log(`Warning: Role '${roleName}' could not be resolved or created.`);
    }
  }

  console.log("Permission synchronization completed successfully.");
}

main()
  .catch((e) => {
    console.error("Synchronization failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
