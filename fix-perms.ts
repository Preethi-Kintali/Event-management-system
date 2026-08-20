import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const orgAdmin = await prisma.role.findFirst({ where: { name: 'Organization Admin' } });
  if (!orgAdmin) return;

  const paymentPerms = await prisma.permission.findMany({
    where: { action: { startsWith: 'payments' } }
  });

  for (const perm of paymentPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: orgAdmin.id,
          permissionId: perm.id
        }
      },
      update: {},
      create: {
        roleId: orgAdmin.id,
        permissionId: perm.id
      }
    });
  }
  console.log("Added payment permissions to Organization Admin");
}
main();
