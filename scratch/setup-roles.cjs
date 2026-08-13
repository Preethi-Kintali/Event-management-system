const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Manager and Participant granular permissions...");

  const permissionsToSeed = [
    'manager.events.read', 'manager.events.create', 'manager.events.update', 'manager.events.delete',
    'manager.registrations.read', 'manager.registrations.manage',
    'manager.teams.read', 'manager.teams.manage',
    'manager.submissions.read',
    'manager.evaluations.read', 'manager.evaluations.manage',
    'manager.judges.read', 'manager.judges.manage',
    'manager.mentors.read', 'manager.mentors.manage',
    'manager.volunteers.read', 'manager.volunteers.manage',
    'manager.attendance.read', 'manager.attendance.manage',
    'manager.certificates.read', 'manager.certificates.manage',
    'manager.reports.read',

    'participant.events.read',
    'participant.registrations.read', 'participant.registrations.create',
    'participant.teams.read', 'participant.teams.create', 'participant.teams.manage',
    'participant.submissions.read', 'participant.submissions.create', 'participant.submissions.update',
    'participant.certificates.read',
    'participant.badges.read',
    'participant.notifications.read'
  ];

  const createdPermissions = {};
  for (const p of permissionsToSeed) {
    createdPermissions[p] = await prisma.permission.upsert({
      where: { action: p },
      update: {},
      create: { action: p, description: `Allows ${p}` }
    });
  }

  const managerRole = await prisma.role.findFirst({
    where: { name: 'Manager' }
  });

  if (!managerRole) {
    console.log("Manager role not found. Creating one globally.");
    const newManager = await prisma.role.create({
      data: { name: 'Manager', description: 'Manager role' }
    });
    for (const p of permissionsToSeed) {
      if (p.startsWith('manager.')) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: newManager.id, permissionId: createdPermissions[p].id } },
          update: {},
          create: { roleId: newManager.id, permissionId: createdPermissions[p].id }
        });
      }
    }
  } else {
    console.log("Assigning manager permissions to existing Manager role...");
    for (const p of permissionsToSeed) {
      if (p.startsWith('manager.')) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: managerRole.id, permissionId: createdPermissions[p].id } },
          update: {},
          create: { roleId: managerRole.id, permissionId: createdPermissions[p].id }
        });
      }
    }
  }

  const participantRole = await prisma.role.findFirst({
    where: { name: 'Participant' }
  });

  if (participantRole) {
    console.log("Assigning participant permissions to existing Participant role...");
    for (const p of permissionsToSeed) {
      if (p.startsWith('participant.')) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: participantRole.id, permissionId: createdPermissions[p].id } },
          update: {},
          create: { roleId: participantRole.id, permissionId: createdPermissions[p].id }
        });
      }
    }
  }

  const managerUser = await prisma.user.findUnique({ where: { email: 'manager@contoso.com' } });
  const org = await prisma.organization.findFirst({ where: { slug: 'contoso-labs' } });
  
  if (managerUser && org) {
    const finalManagerRole = await prisma.role.findFirst({ where: { name: 'Manager' } });
    if (finalManagerRole) {
      await prisma.organizationMember.upsert({
        where: { userId_organizationId: { userId: managerUser.id, organizationId: org.id } },
        update: { roleId: finalManagerRole.id },
        create: { userId: managerUser.id, organizationId: org.id, roleId: finalManagerRole.id, status: 'ACTIVE' }
      });
      console.log("manager@contoso.com assigned to Manager role in Contoso Labs.");
    }
  }

  console.log("Permissions seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
