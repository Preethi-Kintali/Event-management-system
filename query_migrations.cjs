const { PrismaClient } = require("@prisma/client");
async function main() {
  const prisma = new PrismaClient();
  try {
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations ORDER BY started_at ASC;`;
    console.log(JSON.stringify(migrations, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
