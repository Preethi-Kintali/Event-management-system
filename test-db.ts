import { PrismaClient } from '@prisma/client';

async function testConnection(url: string) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log(`Successfully connected to: ${url}`);
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error(`Failed to connect to: ${url}`);
    console.error(error.message);
    await prisma.$disconnect();
    return false;
  }
}

async function main() {
  const urlsToTest = [
    "postgresql://postgres:1508@127.0.0.1:5432/ascent_db",
    "postgresql://postgres:1508@localhost:5432/ascent_db",
    "postgresql://postgres:postgres@127.0.0.1:5432/ascent_db",
    "postgresql://postgres:@127.0.0.1:5432/ascent_db",
  ];

  for (const url of urlsToTest) {
    await testConnection(url);
    console.log('---');
  }
}

main();
