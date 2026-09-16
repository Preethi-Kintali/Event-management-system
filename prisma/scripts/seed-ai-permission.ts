import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let perm = await prisma.permission.findUnique({ where: { action: 'ai_copilot.use' } });
  if (!perm) {
    perm = await prisma.permission.create({ data: { action: 'ai_copilot.use', description: 'Use AI Copilot' } });
    console.log('Created ai_copilot.use permission');
  }

  const roles = await prisma.role.findMany({
    where: {
      name: {
        in: ['Platform Admin', 'Organization Admin', 'Manager', 'Faculty Coordinator', 'Student Coordinator', 'Principal', 'Faculty Organizer', 'Student Organizer']
      }
    }
  });

  for (const role of roles) {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId: role.id, permissionId: perm.id }
    });
    if (!existing) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: perm.id }
      });
      console.log(`Added ai_copilot.use to ${role.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
