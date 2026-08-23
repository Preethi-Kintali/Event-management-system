const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: 'postgresql://postgres:1508@localhost:5432/postgres' } } });
async function run() {
  await p.$executeRawUnsafe('DROP DATABASE IF EXISTS ascent_db_shadow');
  await p.$executeRawUnsafe('CREATE DATABASE ascent_db_shadow');
  console.log('Shadow DB created!');
}
run().catch(console.error).finally(() => p.$disconnect());
