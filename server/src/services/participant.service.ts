import { prisma } from "../utils/prisma";

export class ParticipantService {
  static async getDashboardStats(userId: string) {
    const registeredEventsCount = await prisma.registration.count({
      where: { userId, status: 'APPROVED' }
    });

    const activeTeamsCount = await prisma.teamMember.count({
      where: { userId }
    });

    const certificatesCount = await prisma.certificate.count({
      where: { userId, status: 'ISSUED' }
    });

    const mySubmissions = await prisma.submission.count({
      where: { team: { members: { some: { userId } } } }
    });

    const upcomingEvents = await prisma.registration.findMany({
      where: { userId, status: 'APPROVED', event: { startTime: { gte: new Date() } } },
      include: { event: true },
      orderBy: { event: { startTime: 'asc' } },
      take: 5
    });

    return {
      registeredEventsCount,
      activeTeamsCount,
      certificatesCount,
      mySubmissions,
      upcomingEvents: upcomingEvents.map(r => r.event)
    };
  }

  static async getDiscoverEvents() {
    return prisma.event.findMany({
      where: { 
        status: { in: ['PUBLISHED', 'LIVE'] },
        endTime: { gte: new Date() }
      },
      include: { competitions: true },
      orderBy: { startTime: 'asc' },
      take: 20
    });
  }

  static async getMyRegistrations(userId: string) {
    return prisma.registration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getMyTeams(userId: string) {
    return prisma.teamMember.findMany({
      where: { userId },
      include: { 
        team: {
          include: {
            competition: { include: { event: true } },
            members: { include: { user: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getMySubmissions(userId: string) {
    return prisma.submission.findMany({
      where: { team: { members: { some: { userId } } } },
      include: { team: true, competition: { include: { event: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getMyCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      include: { event: true, competition: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getMyAchievements(userId: string) {
    return prisma.badgeAward.findMany({
      where: { recipientUserId: userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' }
    });
  }

  static async getMyNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { recipientUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  static async registerForEvent(userId: string, data: { eventId: string }) {
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    if (event.registrationType === "TEAM") {
      throw { status: 400, code: "BAD_REQUEST", message: "This event requires team registration." };
    }
    const now = new Date();
    if (event.registrationStart && now < event.registrationStart) {
      throw { status: 400, code: "BAD_REQUEST", message: "Registration has not started yet." };
    }
    if (event.registrationEnd && now > event.registrationEnd) {
      throw { status: 400, code: "BAD_REQUEST", message: "Registration is closed." };
    }

    const existing = await prisma.registration.findFirst({
      where: { userId, eventId: data.eventId }
    });
    if (existing) {
      throw { status: 400, code: "DUPLICATE", message: "Already registered for this event." };
    }
    return prisma.registration.create({
      data: {
        userId,
        eventId: data.eventId,
        status: "PENDING"
      }
    });
  }

  static async registerTeamForEvent(userId: string, data: { eventId: string, teamName: string, competitionId: string, members: string[] }) {
    const event = await prisma.event.findUnique({ 
      where: { id: data.eventId },
      include: { competitions: true }
    });
    if (!event) throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    if (event.registrationType !== "TEAM") {
      throw { status: 400, code: "BAD_REQUEST", message: "This event does not support team registration." };
    }

    const now = new Date();
    if (event.registrationStart && now < event.registrationStart) {
      throw { status: 400, code: "BAD_REQUEST", message: "Registration has not started yet." };
    }
    if (event.registrationEnd && now > event.registrationEnd) {
      throw { status: 400, code: "BAD_REQUEST", message: "Registration is closed." };
    }

    const teamSize = (data.members?.length || 0) + 1; // including the user
    if (event.minTeamSize && teamSize < event.minTeamSize) {
      throw { status: 400, code: "BAD_REQUEST", message: `Team size must be at least ${event.minTeamSize}.` };
    }
    if (event.maxTeamSize && teamSize > event.maxTeamSize) {
      throw { status: 400, code: "BAD_REQUEST", message: `Team size must be at most ${event.maxTeamSize}.` };
    }

    const validCompetition = event.competitions.find(c => c.id === data.competitionId);
    if (!validCompetition) {
      throw { status: 400, code: "BAD_REQUEST", message: "Invalid competition for this event." };
    }

    const existing = await prisma.registration.findFirst({
      where: { userId, eventId: data.eventId }
    });
    if (existing) {
      throw { status: 400, code: "DUPLICATE", message: "Already registered for this event." };
    }

    return prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          userId,
          eventId: data.eventId,
          status: "PENDING"
        }
      });

      const team = await tx.team.create({
        data: {
          name: data.teamName,
          competitionId: data.competitionId,
          members: {
            create: {
              userId,
              isLead: true
            }
          }
        }
      });

      if (data.members && data.members.length > 0) {
        for (const email of data.members) {
          await tx.teamInvitation.create({
            data: {
              teamId: team.id,
              email: email
            }
          });
        }
      }

      return reg;
    });
  }

  static async withdrawRegistration(userId: string, id: string) {
    const reg = await prisma.registration.findFirst({
      where: { id, userId }
    });
    if (!reg) {
      throw { status: 404, code: "NOT_FOUND", message: "Registration not found." };
    }
    return prisma.registration.delete({
      where: { id }
    });
  }

  static async createTeam(userId: string, data: { name: string, competitionId: string }) {
    return prisma.team.create({
      data: {
        name: data.name,
        competitionId: data.competitionId,
        members: {
          create: {
            userId,
            isLead: true
          }
        }
      }
    });
  }

  static async inviteTeamMember(userId: string, teamId: string, data: { email: string }) {
    // Check if user is captain
    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId, isLead: true }
    });
    if (!membership) {
      throw { status: 403, code: "FORBIDDEN", message: "Only captains can invite." };
    }
    const invitedUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (!invitedUser) throw { status: 404, code: "NOT_FOUND", message: "User not found." };

    return prisma.teamMember.create({
      data: {
        teamId,
        userId: invitedUser.id,
        isLead: false
      }
    });
  }

  static async acceptTeamInvite(userId: string, teamId: string) {
    // Mocking acceptance logic if it was a real invite model
    return { success: true };
  }

  static async createSubmission(userId: string, data: { teamId: string, content: string, competitionId: string }) {
    // Verify membership
    const member = await prisma.teamMember.findFirst({
      where: { teamId: data.teamId, userId }
    });
    if (!member) throw { status: 403, code: "FORBIDDEN", message: "Not a team member." };

    return prisma.submission.create({
      data: {
        teamId: data.teamId,
        competitionId: data.competitionId,
        status: "DRAFT"
      }
    });
  }

  static async updateSubmission(userId: string, submissionId: string, data: any) {
    const sub = await prisma.submission.findUnique({ where: { id: submissionId }, include: { team: { include: { members: true } } } });
    if (!sub) throw { status: 404, code: "NOT_FOUND", message: "Submission not found." };
    if (!sub.team.members.find((m: any) => m.userId === userId)) {
      throw { status: 403, code: "FORBIDDEN", message: "Not a team member." };
    }
    return prisma.submission.update({
      where: { id: submissionId },
      data
    });
  }

  static async markNotificationRead(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({ where: { id, recipientUserId: userId } });
    if (!notification) throw { status: 404, code: "NOT_FOUND", message: "Notification not found." };
    
    return prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });
  }
}
