import { PrismaClient, EventStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const passwordHash = await bcrypt.hash('password123', 10);
  
  // 1. Get main organization
  const org = await prisma.organization.findFirst({
    where: { slug: 'contoso-labs' }
  });

  if (!org) {
    throw new Error("Default organization not found. Please run main seed first.");
  }

  // 2. Get Roles
  const roles = await prisma.role.findMany({
    where: { organizationId: org.id }
  });

  const fcRole = roles.find(r => r.name === 'Faculty Coordinator');
  const scRole = roles.find(r => r.name === 'Student Coordinator');
  const ptRole = roles.find(r => r.name === 'Participant');

  if (!fcRole || !scRole || !ptRole) {
    throw new Error("Required roles not found.");
  }

  // 3. Create Users
  console.log('Creating users...');
  
  const fcs = [];
  const scs = [];
  const pts = [];

  for (let i = 1; i <= 3; i++) {
    // Create Faculty Coordinator
    const fc = await prisma.user.upsert({
      where: { email: `faculty${i}@contoso.com` },
      update: {},
      create: {
        email: `faculty${i}@contoso.com`,
        firstName: `Demo`,
        lastName: `Faculty ${i}`,
        passwordHash,
        status: 'ACTIVE',
        memberships: {
          create: { organizationId: org.id, roleId: fcRole.id }
        }
      }
    });
    fcs.push(fc);

    // Create Student Coordinator
    const sc = await prisma.user.upsert({
      where: { email: `student${i}@contoso.com` },
      update: {},
      create: {
        email: `student${i}@contoso.com`,
        firstName: `Demo`,
        lastName: `Student ${i}`,
        passwordHash,
        status: 'ACTIVE',
        memberships: {
          create: { organizationId: org.id, roleId: scRole.id }
        }
      }
    });
    scs.push(sc);

    // Create Participant
    const pt = await prisma.user.upsert({
      where: { email: `participant${i}@contoso.com` },
      update: {},
      create: {
        email: `participant${i}@contoso.com`,
        firstName: `Demo`,
        lastName: `Participant ${i}`,
        passwordHash,
        status: 'ACTIVE',
        memberships: {
          create: { organizationId: org.id, roleId: ptRole.id }
        }
      }
    });
    pts.push(pt);
  }

  // 4. Create Events
  console.log('Creating events and assignments...');
  
  for (let i = 1; i <= 3; i++) {
    const event = await prisma.event.create({
      data: {
          name: `Demo Event ${i} - 2026`,
        description: `This is a sample event to demonstrate coordinator assignments.`,
        status: EventStatus.DRAFT,
        organizationId: org.id,
        startTime: new Date(Date.now() + 86400000 * (i * 10)),
        endTime: new Date(Date.now() + 86400000 * (i * 10 + 2)),
        
        teamMembers: {
          create: [
            {
              userId: fcs[i-1].id,
              responsibility: 'Faculty Coordinator'
            },
            {
              userId: scs[i-1].id,
              responsibility: 'Primary Student Coordinator'
            }
          ]
        }
      }
    });
    console.log(`Created Event: ${event.name}`);
  }

  console.log('Demo data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
