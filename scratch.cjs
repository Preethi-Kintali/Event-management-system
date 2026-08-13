const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'manager@contoso.com' } });
  if (!user) {
    console.log("Manager user not found.");
    return;
  }

  const member = await prisma.organizationMember.findFirst({ where: { userId: user.id } });
  if (!member) {
    console.log("Organization membership not found.");
    return;
  }

  let managerRole = await prisma.role.findFirst({
    where: { name: 'Manager', organizationId: member.organizationId }
  });

  if (!managerRole) {
    console.log("Creating Manager role...");
    managerRole = await prisma.role.create({
      data: {
        name: 'Manager',
        organizationId: member.organizationId,
        description: 'Organization Manager'
      }
    });

    const perms = [
      'events.read', 'events.create', 'events.update', 'events.delete',
      'competitions.read', 'competitions.manage',
      'registrations.read', 'registrations.manage',
      'teams.read', 'teams.manage',
      'submissions.read', 'submissions.manage',
      'evaluations.read', 'evaluations.manage',
      'communications.read', 'communications.create', 'notifications.read', 'notifications.manage',
      'reports.read'
    ];

    const allPerms = await prisma.permission.findMany();
    for (const action of perms) {
      const p = allPerms.find(x => x.action === action);
      if (p) {
        await prisma.rolePermission.create({
          data: { roleId: managerRole.id, permissionId: p.id }
        });
      }
    }
  }

  console.log("Assigning Manager role to manager@contoso.com...");
  await prisma.organizationMember.update({
    where: { id: member.id },
    data: { roleId: managerRole.id }
  });

  console.log("Manager role setup complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
