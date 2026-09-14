import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Privileged Account RBAC sync...');

  // 1. Define required permissions
  const permissionsToEnsure = [
    { action: 'users.create_manager', description: 'Allows creation of Manager accounts' },
    { action: 'users.create_faculty_coordinator', description: 'Allows creation of Faculty Coordinator accounts' },
    { action: 'users.read_faculty_coordinator', description: 'Allows reading Faculty Coordinator accounts' },
    { action: 'users.update_faculty_coordinator', description: 'Allows updating Faculty Coordinator accounts' },
    { action: 'users.delete_faculty_coordinator', description: 'Allows deleting Faculty Coordinator accounts' },
    { action: 'users.create_principal', description: 'Allows creation of Principal accounts' },
    { action: 'users.create_student_coordinator', description: 'Allows creation of Student Coordinator accounts' },
    { action: 'users.create_participant', description: 'Allows creation of Participant accounts' },
    { action: 'events.assign_faculty_coordinator', description: 'Allows assigning a faculty coordinator to an event' },
    { action: 'events.manage_student_coordinators', description: 'Allows managing student coordinators for an event' },
    { action: 'events.assign_student_coordinator', description: 'Allows assigning a student coordinator to an event' },
    { action: 'events.remove_student_coordinator', description: 'Allows removing a student coordinator from an event' },
    { action: 'users.read_student_coordinator', description: 'Allows reading Student Coordinator accounts' },
    { action: 'users.update_student_coordinator', description: 'Allows updating Student Coordinator accounts' },
    { action: 'users.delete_student_coordinator', description: 'Allows deleting Student Coordinator accounts' },
    { action: 'users.read_participant', description: 'Allows reading Participant accounts' },
    { action: 'users.update_participant', description: 'Allows updating Participant accounts' },
    { action: 'organization.read', description: 'Allows reading organization details' }
  ];

  // Upsert permissions
  for (const perm of permissionsToEnsure) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: perm
    });
    console.log(`Ensured permission: ${perm.action}`);
  }

  // 2. Map permissions to roles
  const rolePermissionMap: Record<string, string[]> = {
    'Platform Admin': ['users.create_manager', 'users.create_faculty_coordinator', 'users.read_faculty_coordinator', 'users.update_faculty_coordinator', 'users.delete_faculty_coordinator', 'events.assign_faculty_coordinator', 'events.manage_student_coordinators', 'events.assign_student_coordinator', 'events.remove_student_coordinator', 'users.create_principal', 'users.create_student_coordinator', 'users.create_participant'],
    'Organization Admin': ['users.create_manager', 'users.create_faculty_coordinator', 'users.read_faculty_coordinator', 'users.update_faculty_coordinator', 'users.delete_faculty_coordinator', 'events.assign_faculty_coordinator', 'events.manage_student_coordinators', 'events.assign_student_coordinator', 'events.remove_student_coordinator', 'users.create_principal', 'users.create_student_coordinator', 'users.create_participant', 'organization.read'],
    'Manager': ['users.create_faculty_coordinator', 'users.read_faculty_coordinator', 'users.update_faculty_coordinator', 'users.delete_faculty_coordinator', 'events.assign_faculty_coordinator', 'organization.read'],
    'Faculty Coordinator': ['events.manage_student_coordinators', 'events.assign_student_coordinator', 'events.remove_student_coordinator', 'users.create_student_coordinator', 'users.read_student_coordinator', 'users.update_student_coordinator', 'users.delete_student_coordinator', 'organization.read'],
    'Student Coordinator': ['organization.read', 'users.read_participant', 'users.update_participant']
  };

  for (const [roleName, actions] of Object.entries(rolePermissionMap)) {
    // Find role
    const roles = await prisma.role.findMany({
      where: { name: roleName }
    });

    for (const role of roles) {
      for (const action of actions) {
        const permission = await prisma.permission.findUnique({
          where: { action }
        });

        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id
            }
          });
          console.log(`Assigned ${action} to ${roleName} (Role ID: ${role.id})`);
        }
      }
    }
  }

  console.log('Privileged Account RBAC sync completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error syncing RBAC:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
