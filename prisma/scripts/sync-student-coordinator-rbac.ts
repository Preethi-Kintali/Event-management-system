import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Student Coordinator RBAC sync...");

  const newPermissions = [
    { action: 'events.read_assigned', description: 'Allows reading assigned events' },
    { action: 'hackathon_proposals.read_own', description: 'Allows reading own hackathon proposals' },
    { action: 'hackathon_proposals.update_own', description: 'Allows updating own hackathon proposals' },
    { action: 'hackathon_proposals.delete_own', description: 'Allows deleting own hackathon proposals' },
    { action: 'hackathon_proposals.create_event_own', description: 'Allows creating event from own approved proposals' },
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

  const studentCoordinatorRequiredActions = [
    'hackathon_proposals.create',
    'hackathon_proposals.read_own',
    'hackathon_proposals.update_own',
    'hackathon_proposals.delete_own',
    'hackathon_proposals.submit',
    'hackathon_proposals.create_event_own',
    'events.read_assigned',
    'notifications.read'
  ];

  const studentCoordinatorForbiddenActions = [
    'events.read',
    'events.create',
    'events.update',
    'events.complete',
    'hackathon_proposals.read',
    'hackathon_proposals.update',
    'hackathon_proposals.review',
    'hackathon_proposals.principal_review',
    'hackathon_proposals.create_event',
    'reports.generate'
  ];

  // 3. Find all Student Coordinator roles
  const studentCoordinatorRoles = await prisma.role.findMany({
    where: { name: 'Student Coordinator' },
  });

  for (const role of studentCoordinatorRoles) {
    console.log(`Updating role ID: ${role.id} (Org ID: ${role.organizationId})`);

    // 4. Assign required permissions
    for (const action of studentCoordinatorRequiredActions) {
      const permId = permMap.get(action);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId
            }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId
          }
        });
      }
    }

    // 5. Remove excessive permissions
    for (const action of studentCoordinatorForbiddenActions) {
      const permId = permMap.get(action);
      if (permId) {
        try {
          await prisma.rolePermission.delete({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permId
              }
            }
          });
          console.log(`  Removed excessive permission: ${action}`);
        } catch (error: any) {
          // Ignore error if it doesn't exist
          if (error.code !== 'P2025') {
            console.error(`Error deleting permission ${action}:`, error);
          }
        }
      }
    }
  }

  console.log("Student Coordinator RBAC sync completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
