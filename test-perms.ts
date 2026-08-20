import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const role = await prisma.role.findFirst({
    where: { name: 'MANAGER' },
    include: { permissions: { include: { permission: true } } }
  });
  console.log("Manager permissions:", role?.permissions.map(rp => rp.permission.action));
}
main();
