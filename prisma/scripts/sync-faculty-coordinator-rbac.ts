import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Faculty Coordinator RBAC sync...");

  const newPermissions = [
    { action: 'events.assign_faculty_coordinator', description: 'Allows assigning a faculty coordinator to an event' },
    { action: 'events.assign_student_coordinator', description: 'Allows assigning a student coordinator to an event' },
    { action: 'events.remove_student_coordinator', description: 'Allows removing a student coordinator from an event' },
    { action: 'events.read_assigned', description: 'Allows reading assigned events' },
    { action: 'events.update_assigned', description: 'Allows updating assigned events' },
    { action: 'notifications.read', description: 'Allows reading notifications' },
  ];

  for (const perm of newPermissions) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: { action: perm.action, description: perm.description },
    });
  }

  const allPerms = await prisma.permission.findMany();
  const permMap = new Map(allPerms.map(p => [p.action, p.id]));

  const managerActions = [
    'events.assign_faculty_coordinator',
  ];

  const facultyCoordinatorActions = [
    'events.assign_student_coordinator',
    'events.remove_student_coordinator',
    'events.read_assigned',
    'events.update_assigned',
    'notifications.read',
  ];

  const managerRoles = await prisma.role.findMany({
    where: { name: { in: ['Organization Admin', 'Platform Admin', 'Manager'] } },
  });

  const facultyCoordinatorRoles = await prisma.role.findMany({
    where: { name: 'Faculty Coordinator' },
  });

  for (const role of managerRoles) {
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

  for (const role of facultyCoordinatorRoles) {
    for (const action of facultyCoordinatorActions) {
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

  console.log("Faculty Coordinator RBAC sync completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
