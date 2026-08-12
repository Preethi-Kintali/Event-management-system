import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.attendanceSession.count();
  console.log('Sessions count:', count);
  if (count === 0) {
    const event = await prisma.event.findFirst();
    if (event) {
      await prisma.attendanceSession.create({
        data: {
          eventId: event.id,
          name: "Opening Keynote",
          description: "Welcome to the event",
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000),
          status: "PUBLISHED"
        }
      });
      console.log('Created a session for event:', event.name);
    }
  }
}
main().finally(() => prisma.$disconnect());
