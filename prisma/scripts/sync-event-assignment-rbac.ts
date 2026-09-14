import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Event Assignment RBAC sync...");

  const newPermissions = [
    { action: 'events.assign_coordinator', description: 'Allows assigning a student coordinator to an event' },
    { action: 'reports.create_assigned', description: 'Allows creating a report for an assigned event' },
    { action: 'reports.read_assigned', description: 'Allows reading reports for assigned events' },
    { action: 'reports.update_assigned', description: 'Allows updating reports for assigned events' },
    { action: 'reports.finalize_assigned', description: 'Allows finalizing reports for assigned events' },
  ];

  // 1. Upsert new permissions safely
  for (const perm of newPermissions) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
  }

  // 2. Get the new permission IDs
  const allPerms = await prisma.permission.findMany();
  const permMap = new Map(allPerms.map(p => [p.action, p.id]));

  // Actions for Manager / Admin
  const managerActions = [
    'events.assign_coordinator',
  ];

  // Actions for Student Coordinator
  const studentCoordinatorActions = [
    'reports.create_assigned',
    'reports.read_assigned',
    'reports.update_assigned',
    'reports.finalize_assigned',
  ];

  // 3. Find roles
  const managerRoles = await prisma.role.findMany({
    where: { name: { in: ['Organization Admin', 'Platform Admin', 'Manager'] } },
  });

  const studentCoordinatorRoles = await prisma.role.findMany({
    where: { name: 'Student Coordinator' },
  });

  // 4. Assign Manager permissions
  for (const role of managerRoles) {
    console.log(`Updating Manager/Admin role ID: ${role.id} (${role.name})`);
    for (const action of managerActions) {
      const permId = permMap.get(action);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
          update: {},
          create: { roleId: role.id, permissionId: permId }
        });
      }
    }
  }

  // 5. Assign Student Coordinator permissions
  for (const role of studentCoordinatorRoles) {
    console.log(`Updating Student Coordinator role ID: ${role.id}`);
    for (const action of studentCoordinatorActions) {
      const permId = permMap.get(action);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
          update: {},
          create: { roleId: role.id, permissionId: permId }
        });
      }
    }
  }

  console.log("Event Assignment RBAC sync completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
