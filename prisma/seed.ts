import {
  PrismaClient,
  UserStatus,
  OrganizationStatus,
  EventStatus,
  SubmissionStatus,
  EvaluationStatus,
  AttendanceMethod,
  AttendanceStatus,
  SessionStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data (idempotent for dev)
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.volunteerEvent.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.teamMentor.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.judgeCompetition.deleteMany();
  await prisma.judge.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.event.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.role.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // 2. Permissions
  const permissionsData = [
    'platform.read', 'platform.manage',
    'organization.read', 'organization.manage',
    'users.read', 'users.manage',
    'events.read', 'events.create', 'events.update', 'events.delete',
    'competitions.read', 'competitions.manage',
    'registrations.read', 'registrations.manage',
    'teams.read', 'teams.manage',
    'submissions.read', 'submissions.manage',
    'evaluations.read', 'evaluations.manage',
    'certificates.read', 'certificates.manage', 'certificates.create', 'certificates.update', 'certificates.delete', 'certificates.issue', 'certificates.revoke',
  ];

  const permissions: Record<string, { id: string; action: string }> = {};
  for (const p of permissionsData) {
    permissions[p] = await prisma.permission.create({
      data: { action: p, description: `Allows ${p}` },
    });
  }

  // 3. Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const platformAdmin = await prisma.user.create({
    data: { email: 'admin@ascent.dev', firstName: 'Admin', lastName: 'User', passwordHash, status: UserStatus.ACTIVE },
  });

  const orgManager = await prisma.user.create({
    data: { email: 'manager@contoso.com', firstName: 'Alice', lastName: 'Manager', passwordHash, status: UserStatus.ACTIVE },
  });

  const participant1 = await prisma.user.create({
    data: { email: 'bob@gmail.com', firstName: 'Bob', lastName: 'Participant', passwordHash, status: UserStatus.ACTIVE },
  });

  const judgeUser1 = await prisma.user.create({
    data: { email: 'elena@ascent.dev', firstName: 'Elena', lastName: 'Markovic', passwordHash, status: UserStatus.ACTIVE },
  });

  const judgeUser2 = await prisma.user.create({
    data: { email: 'rajat@ascent.dev', firstName: 'Rajat', lastName: 'Menon', passwordHash, status: UserStatus.ACTIVE },
  });

  const mentorUser1 = await prisma.user.create({
    data: { email: 'arjun@ascent.dev', firstName: 'Arjun', lastName: 'Deshpande', passwordHash, status: UserStatus.ACTIVE },
  });

  const mentorUser2 = await prisma.user.create({
    data: { email: 'lena@ascent.dev', firstName: 'Lena', lastName: 'Fischer', passwordHash, status: UserStatus.ACTIVE },
  });

  const volunteerUser1 = await prisma.user.create({
    data: { email: 'tomas@ascent.dev', firstName: 'Tomas', lastName: 'Duarte', passwordHash, status: UserStatus.ACTIVE },
  });

  const volunteerUser2 = await prisma.user.create({
    data: { email: 'ishita@ascent.dev', firstName: 'Ishita', lastName: 'Bose', passwordHash, status: UserStatus.ACTIVE },
  });

  const participant2 = await prisma.user.create({
    data: { email: 'participant2@gmail.com', firstName: 'Carol', lastName: 'Dev', passwordHash, status: UserStatus.ACTIVE },
  });

  // 4. Organizations
  const org1 = await prisma.organization.create({
    data: { name: 'Contoso Innovation Labs', slug: 'contoso-labs', status: OrganizationStatus.ACTIVE },
  });

  const org2 = await prisma.organization.create({
    data: { name: 'Northwind Institute', slug: 'northwind-institute', status: OrganizationStatus.ACTIVE },
  });

  // 5. Roles
  const globalAdminRole = await prisma.role.create({
    data: { name: 'Platform Admin', description: 'Global administrator' },
  });

  const orgAdminRole = await prisma.role.create({
    data: { name: 'Organization Admin', organizationId: org1.id, description: 'Org administrator' },
  });

  const judgeRole = await prisma.role.create({
    data: { name: 'Judge', organizationId: org1.id, description: 'Evaluates submissions' },
  });

  const participantRole = await prisma.role.create({
    data: { name: 'Participant', organizationId: org1.id, description: 'Event participant' },
  });

  const mentorRole = await prisma.role.create({
    data: { name: 'Mentor', organizationId: org1.id, description: 'Coaches teams' },
  });

  const volunteerRole = await prisma.role.create({
    data: { name: 'Volunteer', organizationId: org1.id, description: 'Event volunteer' },
  });

  // Assign permissions
  for (const p of permissionsData) {
    await prisma.rolePermission.create({ data: { roleId: globalAdminRole.id, permissionId: permissions[p].id } });
  }

  const orgAdminPerms = [
    'events.read', 'events.create', 'events.update', 'events.delete',
    'competitions.read', 'competitions.manage',
    'registrations.read', 'registrations.manage',
    'teams.read', 'teams.manage',
    'submissions.read', 'submissions.manage',
    'evaluations.read', 'evaluations.manage',
    'certificates.read', 'certificates.create', 'certificates.update', 'certificates.delete', 'certificates.issue', 'certificates.revoke',
  ];
  for (const p of orgAdminPerms) {
    await prisma.rolePermission.create({ data: { roleId: orgAdminRole.id, permissionId: permissions[p].id } });
  }

  const judgePerms = ['evaluations.read', 'submissions.read'];
  for (const p of judgePerms) {
    await prisma.rolePermission.create({ data: { roleId: judgeRole.id, permissionId: permissions[p].id } });
  }

  await prisma.rolePermission.create({ data: { roleId: participantRole.id, permissionId: permissions['events.read'].id } });
  await prisma.rolePermission.create({ data: { roleId: mentorRole.id, permissionId: permissions['events.read'].id } });
  await prisma.rolePermission.create({ data: { roleId: volunteerRole.id, permissionId: permissions['events.read'].id } });

  // 6. Organization Memberships
  const allUsersForOrg = [
    { userId: platformAdmin.id, roleId: globalAdminRole.id },
    { userId: orgManager.id, roleId: orgAdminRole.id },
    { userId: participant1.id, roleId: participantRole.id },
    { userId: judgeUser1.id, roleId: judgeRole.id },
    { userId: judgeUser2.id, roleId: judgeRole.id },
    { userId: mentorUser1.id, roleId: mentorRole.id },
    { userId: mentorUser2.id, roleId: mentorRole.id },
    { userId: volunteerUser1.id, roleId: volunteerRole.id },
    { userId: volunteerUser2.id, roleId: volunteerRole.id },
    { userId: participant2.id, roleId: participantRole.id },
  ];

  for (const m of allUsersForOrg) {
    await prisma.organizationMember.create({
      data: { userId: m.userId, organizationId: org1.id, roleId: m.roleId, status: 'ACTIVE' },
    });
  }

  // 7. Events
  const event1 = await prisma.event.create({
    data: {
      name: 'Global AI Hackathon 2026',
      description: 'The biggest AI hackathon of the year.',
      organizationId: org1.id,
      status: EventStatus.PUBLISHED,
      startTime: new Date('2026-10-01T09:00:00Z'),
      endTime: new Date('2026-10-03T18:00:00Z'),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Northwind Design Challenge',
      description: 'Annual product design competition for students.',
      organizationId: org1.id,
      status: EventStatus.DRAFT,
      startTime: new Date('2026-11-15T09:00:00Z'),
      endTime: new Date('2026-11-17T18:00:00Z'),
    },
  });

  // 8. Competitions
  const comp1 = await prisma.competition.create({
    data: {
      name: 'AI for Accessibility Track',
      description: 'Build AI solutions that improve accessibility for people with disabilities.',
      eventId: event1.id,
    },
  });

  const comp2 = await prisma.competition.create({
    data: {
      name: 'Climate Tech Innovation',
      description: 'Develop technology solutions to combat climate change.',
      eventId: event1.id,
    },
  });

  // 9. Registrations
  await prisma.registration.create({ data: { eventId: event1.id, userId: participant1.id, status: 'APPROVED' } });
  await prisma.registration.create({ data: { eventId: event1.id, userId: participant2.id, status: 'APPROVED' } });
  await prisma.registration.create({ data: { eventId: event1.id, userId: orgManager.id, status: 'APPROVED' } });
  await prisma.registration.create({ data: { eventId: event1.id, userId: judgeUser1.id, status: 'APPROVED' } });
  await prisma.registration.create({ data: { eventId: event1.id, userId: judgeUser2.id, status: 'APPROVED' } });

  // 10. Teams
  const team1 = await prisma.team.create({
    data: {
      name: 'Team Quantum',
      competitionId: comp1.id,
      members: { create: [{ userId: participant1.id, isLead: true }] },
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'Team Nova',
      competitionId: comp1.id,
      members: { create: [{ userId: participant2.id, isLead: true }] },
    },
  });

  // 11. Submissions
  const sub1 = await prisma.submission.create({
    data: {
      title: 'AccessiSight — AI screen reader for the visually impaired',
      payload: { description: 'A real-time AI-powered screen reader using computer vision.', url: 'https://github.com/example/accessisight' },
      teamId: team1.id,
      competitionId: comp1.id,
      status: SubmissionStatus.SUBMITTED,
    },
  });

  const sub2 = await prisma.submission.create({
    data: {
      title: 'SignBridge — Real-time sign language translator',
      payload: { description: 'Uses MediaPipe to translate sign language in real-time.', url: 'https://github.com/example/signbridge' },
      teamId: team2.id,
      competitionId: comp1.id,
      status: SubmissionStatus.IN_REVIEW,
    },
  });

  // 12. Judges
  const judge1 = await prisma.judge.create({
    data: {
      userId: judgeUser1.id,
      organizationId: org1.id,
      expertise: 'Machine Learning',
      bio: 'PhD in ML from MIT, 10 years industry experience.',
    },
  });

  const judge2 = await prisma.judge.create({
    data: {
      userId: judgeUser2.id,
      organizationId: org1.id,
      expertise: 'Accessibility Tech',
      bio: 'Expert in assistive technologies and inclusive design.',
    },
  });

  // Assign judges to competition
  await prisma.judgeCompetition.create({ data: { judgeId: judge1.id, competitionId: comp1.id } });
  await prisma.judgeCompetition.create({ data: { judgeId: judge2.id, competitionId: comp1.id } });

  // 13. Evaluations — assign submissions to judges
  await prisma.evaluation.create({
    data: {
      submissionId: sub1.id,
      judgeId: judgeUser1.id,
      score: 87.5,
      feedback: 'Strong technical depth. Excellent use of on-device inference.',
      status: EvaluationStatus.COMPLETED,
    },
  });

  await prisma.evaluation.create({
    data: {
      submissionId: sub2.id,
      judgeId: judgeUser1.id,
      score: 79,
      feedback: 'Good concept, needs more robust error handling.',
      status: EvaluationStatus.IN_PROGRESS,
    },
  });

  await prisma.evaluation.create({
    data: {
      submissionId: sub1.id,
      judgeId: judgeUser2.id,
      score: null,
      feedback: null,
      status: EvaluationStatus.PENDING,
    },
  });

  await prisma.evaluation.create({
    data: {
      submissionId: sub2.id,
      judgeId: judgeUser2.id,
      score: 82,
      feedback: 'Creative solution with real-world impact potential.',
      status: EvaluationStatus.COMPLETED,
    },
  });

  // 14. Mentors
  const mentor1 = await prisma.mentor.create({
    data: {
      userId: mentorUser1.id,
      organizationId: org1.id,
      expertise: 'Product Strategy',
      bio: 'Former PM at Google, passionate about helping hackathon teams.',
    },
  });

  const mentor2 = await prisma.mentor.create({
    data: {
      userId: mentorUser2.id,
      organizationId: org1.id,
      expertise: 'Cloud Architecture',
      bio: 'AWS Solutions Architect with 8 years of experience.',
    },
  });

  // Assign mentors to teams
  await prisma.teamMentor.create({ data: { mentorId: mentor1.id, teamId: team1.id } });
  await prisma.teamMentor.create({ data: { mentorId: mentor2.id, teamId: team2.id } });
  await prisma.teamMentor.create({ data: { mentorId: mentor1.id, teamId: team2.id } }); // mentor1 also mentors team2

  // 15. Volunteers
  const volunteer1 = await prisma.volunteer.create({
    data: {
      userId: volunteerUser1.id,
      organizationId: org1.id,
      role: 'Registration Desk',
      bio: 'Experienced event organizer.',
    },
  });

  const volunteer2 = await prisma.volunteer.create({
    data: {
      userId: volunteerUser2.id,
      organizationId: org1.id,
      role: 'Logistics',
      bio: 'Logistics expert with event management background.',
    },
  });

  // Assign volunteers to events
  await prisma.volunteerEvent.create({
    data: { volunteerId: volunteer1.id, eventId: event1.id, shiftsCount: 5, hoursCount: 20 },
  });
  await prisma.volunteerEvent.create({
    data: { volunteerId: volunteer2.id, eventId: event1.id, shiftsCount: 7, hoursCount: 28 },
  });
  await prisma.volunteerEvent.create({
    data: { volunteerId: volunteer1.id, eventId: event2.id, shiftsCount: 3, hoursCount: 12 },
  });

  // 16. Attendance Sessions
  const session1 = await prisma.attendanceSession.create({
    data: {
      eventId: event1.id,
      name: 'Opening Keynote',
      description: 'Kick-off session for all participants.',
      startTime: new Date('2026-10-01T09:00:00Z'),
      endTime: new Date('2026-10-01T10:30:00Z'),
      status: SessionStatus.UPCOMING,
    },
  });

  const session2 = await prisma.attendanceSession.create({
    data: {
      eventId: event1.id,
      name: 'Round 1 Judging',
      description: 'First round evaluation by the judge panel.',
      startTime: new Date('2026-10-02T14:00:00Z'),
      endTime: new Date('2026-10-02T18:00:00Z'),
      status: SessionStatus.UPCOMING,
    },
  });

  const session3 = await prisma.attendanceSession.create({
    data: {
      eventId: event1.id,
      name: 'Awards Ceremony',
      description: 'Final ceremony and prize distribution.',
      startTime: new Date('2026-10-03T16:00:00Z'),
      endTime: new Date('2026-10-03T18:00:00Z'),
      status: SessionStatus.UPCOMING,
    },
  });

  // 17. Attendance Records (manual check-ins)
  await prisma.attendanceRecord.create({
    data: {
      sessionId: session1.id,
      userId: participant1.id,
      method: AttendanceMethod.MANUAL,
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date('2026-10-01T08:55:00Z'),
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: session1.id,
      userId: participant2.id,
      method: AttendanceMethod.MANUAL,
      status: AttendanceStatus.LATE,
      checkInTime: new Date('2026-10-01T09:15:00Z'),
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: session1.id,
      userId: judgeUser1.id,
      method: AttendanceMethod.MANUAL,
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date('2026-10-01T08:50:00Z'),
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: session2.id,
      userId: judgeUser1.id,
      method: AttendanceMethod.MANUAL,
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date('2026-10-02T13:58:00Z'),
    },
  });

  await prisma.attendanceRecord.create({
    data: {
      sessionId: session2.id,
      userId: judgeUser2.id,
      method: AttendanceMethod.MANUAL,
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date('2026-10-02T14:02:00Z'),
    },
  });

  // 17. Certificates
  await prisma.certificate.create({
    data: {
      userId: participant1.id,
      organizationId: org1.id,
      eventId: event1.id,
      competitionId: comp1.id,
      certificateNumber: 'CERT-2026-WIN-001',
      type: 'WINNER',
      title: 'First Place Winner',
      description: 'Awarded for exceptional performance in Global AI Hackathon 2026.',
      status: 'ISSUED',
      verificationCode: 'VERIFY-ABC-1234',
    }
  });

  await prisma.certificate.create({
    data: {
      userId: participant2.id,
      organizationId: org1.id,
      eventId: event1.id,
      certificateNumber: 'CERT-2026-PART-002',
      type: 'PARTICIPATION',
      title: 'Certificate of Participation',
      description: 'Awarded for participating in Global AI Hackathon 2026.',
      status: 'ISSUED',
      verificationCode: 'VERIFY-XYZ-5678',
    }
  });

  await prisma.certificate.create({
    data: {
      userId: judgeUser1.id,
      organizationId: org1.id,
      eventId: event1.id,
      certificateNumber: 'CERT-2026-JDG-003',
      type: 'JUDGE',
      title: 'Certificate of Appreciation',
      description: 'Awarded for valuable contribution as a Judge.',
      status: 'ISSUED',
      verificationCode: 'VERIFY-DEF-9012',
    }
  });

  console.log("\n✅ Seeding complete!");
  console.log("─────────────────────────────────────────────");
  console.log("TEST CREDENTIALS (DEVELOPMENT ONLY):");
  console.log("  Platform Admin:  admin@ascent.dev       / password123");
  console.log("  Org Manager:     manager@contoso.com    / password123");
  console.log("  Participant:     bob@gmail.com          / password123");
  console.log("  Judge 1:         elena@ascent.dev       / password123");
  console.log("  Judge 2:         rajat@ascent.dev       / password123");
  console.log("  Mentor 1:        arjun@ascent.dev       / password123");
  console.log("  Mentor 2:        lena@ascent.dev        / password123");
  console.log("  Volunteer 1:     tomas@ascent.dev       / password123");
  console.log("  Volunteer 2:     ishita@ascent.dev      / password123");
  console.log("─────────────────────────────────────────────");
  console.log(`Organizations: ${org1.name}, ${org2.name}`);
  console.log(`Events: ${event1.name}, ${event2.name}`);
  console.log(`Competitions: ${comp1.name}, ${comp2.name}`);
  console.log(`Teams: ${team1.name}, ${team2.name}`);
  console.log(`Submissions: ${sub1.title}, ${sub2.title}`);
  console.log(`Judges: ${judgeUser1.firstName} ${judgeUser1.lastName}, ${judgeUser2.firstName} ${judgeUser2.lastName}`);
  console.log(`Mentors: ${mentorUser1.firstName} ${mentorUser1.lastName}, ${mentorUser2.firstName} ${mentorUser2.lastName}`);
  console.log(`Volunteers: ${volunteerUser1.firstName} ${volunteerUser1.lastName}, ${volunteerUser2.firstName} ${volunteerUser2.lastName}`);
  console.log(`Attendance Sessions: ${session1.name}, ${session2.name}, ${session3.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
