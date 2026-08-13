import { PrismaClient, AttendanceMethod, AttendanceStatus, EvaluationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Adding extra seed data for Evaluation and Attendance...");

  const admin = await prisma.user.findUnique({ where: { email: 'admin@ascent.dev' } });
  const org = await prisma.organization.findUnique({ where: { slug: 'contoso-labs' } });
  
  if (!admin || !org) {
    console.error("Admin user or Organization not found. Seed the main DB first.");
    return;
  }

  // --- 1. Evaluations ---
  // Ensure Admin is a Judge
  let adminJudge = await prisma.judge.findFirst({ where: { userId: admin.id } });
  if (!adminJudge) {
    adminJudge = await prisma.judge.create({
      data: {
        userId: admin.id,
        organizationId: org.id,
        expertise: 'Platform Administration',
        bio: 'Global administrator stepping in to evaluate.',
      }
    });
  }

  // Get a competition and submission
  const comp = await prisma.competition.findFirst();
  const subs = await prisma.submission.findMany({ take: 2 });

  if (comp && subs.length > 0) {
    // Assign admin to the competition
    const judgeCompExists = await prisma.judgeCompetition.findFirst({
      where: { judgeId: adminJudge.id, competitionId: comp.id }
    });
    if (!judgeCompExists) {
      await prisma.judgeCompetition.create({
        data: { judgeId: adminJudge.id, competitionId: comp.id }
      });
    }

    // Create evaluations for admin
    for (const sub of subs) {
      const existingEval = await prisma.evaluation.findFirst({
        where: { submissionId: sub.id, judgeId: admin.id }
      });
      if (!existingEval) {
        await prisma.evaluation.create({
          data: {
            submissionId: sub.id,
            judgeId: admin.id,
            score: Math.floor(Math.random() * 20) + 70, // 70-90
            feedback: 'Looks good from an admin perspective.',
            status: EvaluationStatus.PENDING,
          }
        });
      }
    }
  }

  // --- 2. Attendance ---
  const sessions = await prisma.attendanceSession.findMany({
    where: { event: { organizationId: org.id } }
  });
  
  const users = await prisma.user.findMany({ take: 5 });

  if (sessions.length > 0 && users.length > 0) {
    for (const session of sessions) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        // Randomize status a bit
        let status = AttendanceStatus.PRESENT;
        if (i % 3 === 0) status = AttendanceStatus.LATE;
        if (i % 4 === 0) status = AttendanceStatus.ABSENT;

        // Ensure record doesn't already exist
        const existingRecord = await prisma.attendanceRecord.findUnique({
          where: { sessionId_userId: { sessionId: session.id, userId: user.id } }
        });

        if (!existingRecord) {
          await prisma.attendanceRecord.create({
            data: {
              session: { connect: { id: session.id } },
              user: { connect: { id: user.id } },
              method: 'MANUAL',
              status: status,
              checkInTime: new Date(),
            }
          });
        }
      }
    }
  }

  console.log("Extra data added successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
