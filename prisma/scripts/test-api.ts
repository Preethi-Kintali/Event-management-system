import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
async function check() {
  const u = await prisma.user.findUnique({ where: { email: 'faculty1@contoso.com' } });
  const org = await prisma.organization.findFirst({ where: { slug: 'contoso-labs' } });
  const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET || 'super-secret', { expiresIn: '1d' });
  const res = await fetch('http://localhost:3000/api/v1/organizations/' + org.id + '/members', { headers: { Authorization: 'Bearer ' + token, 'x-organization-id': org.id } });
  console.log(res.status);
  console.log(await res.text());
}
check().finally(() => prisma.$disconnect());
