import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.update({
    where: { email: 'a@gmail.com' },
    data: { passwordHash }
  });
  console.log('Password reset successfully for:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
