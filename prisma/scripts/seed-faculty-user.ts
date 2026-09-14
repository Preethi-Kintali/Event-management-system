import { PrismaClient, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "faculty@contoso.com";
  
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const passwordHash = await bcrypt.hash("password123", 10);
    user = await prisma.user.create({
      data: {
        email,
        firstName: "Faculty",
        lastName: "Coordinator",
        passwordHash,
        status: UserStatus.ACTIVE,
      },
    });
    console.log(`Created user ${email}`);
  }

  // Find org
  const org = await prisma.organization.findFirst({
    where: { slug: "contoso-labs" },
  });
  if (!org) {
    throw new Error("Org not found");
  }

  // Find role
  const role = await prisma.role.findFirst({
    where: { name: "Faculty Coordinator", organizationId: org.id },
  });
  if (!role) {
    throw new Error("Faculty Coordinator role not found");
  }

  // Add membership
  const existingMembership = await prisma.organizationMember.findFirst({
    where: { userId: user.id, organizationId: org.id },
  });

  if (!existingMembership) {
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        roleId: role.id,
        status: "ACTIVE",
      },
    });
    console.log(`Added user ${email} to org ${org.name} as Faculty Coordinator`);
  } else {
    console.log(`User ${email} is already in org ${org.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
