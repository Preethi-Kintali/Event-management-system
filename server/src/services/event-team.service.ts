import { prisma } from "../utils/prisma";
import { NotificationService } from "./notifications.service";

export class EventTeamService {
  static async getTeam(tenantId: string, eventId: string, onlyAssignedUserId?: string) {
    const whereClause: any = { id: eventId, organizationId: tenantId };
    if (onlyAssignedUserId) {
      whereClause.OR = [
        { teamMembers: { some: { userId: onlyAssignedUserId } } }
      ];
    }

    const event = await prisma.event.findFirst({
      where: whereClause
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    return prisma.eventTeamMember.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async addMember(tenantId: string, eventId: string, userId: string, responsibility: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    const orgMember = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId: tenantId } }
    });

    if (!orgMember) {
      throw { status: 403, code: "FORBIDDEN", message: "User does not belong to this organization." };
    }

    try {
      const member = await prisma.eventTeamMember.create({
        data: {
          eventId,
          userId,
          responsibility
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });

      await NotificationService.create({
        organizationId: tenantId,
        recipientUserId: userId,
        title: "Assigned to Event Team",
        message: `You have been assigned as ${responsibility} for ${event.name}.`,
        type: "SYSTEM"
      });

      return member;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw { status: 409, code: "CONFLICT", message: "User is already assigned to this event team." };
      }
      throw e;
    }
  }

  static async updateMember(tenantId: string, eventId: string, memberId: string, responsibility: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    const existingMember = await prisma.eventTeamMember.findFirst({
      where: { id: memberId, eventId }
    });

    if (!existingMember) {
      throw { status: 404, code: "NOT_FOUND", message: "Team member not found in this event." };
    }

    return prisma.eventTeamMember.update({
      where: { id: memberId },
      data: { responsibility },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });
  }

  static async removeMember(tenantId: string, eventId: string, memberId: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    const existingMember = await prisma.eventTeamMember.findFirst({
      where: { id: memberId, eventId }
    });

    if (!existingMember) {
      throw { status: 404, code: "NOT_FOUND", message: "Team member not found in this event." };
    }

    await prisma.eventTeamMember.delete({
      where: { id: memberId }
    });

    return { success: true };
  }

  static async assignPrimaryCoordinator(tenantId: string, eventId: string, userId: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    const orgMember = await prisma.organizationMember.findFirst({
      where: { userId, organizationId: tenantId, role: { name: 'Student Coordinator' } }
    });

    if (!orgMember) {
      throw { status: 403, code: "FORBIDDEN", message: "User is not a valid Student Coordinator in this organization." };
    }

    return prisma.$transaction(async (tx) => {
      await tx.eventTeamMember.deleteMany({
        where: { eventId, responsibility: 'Primary Student Coordinator' }
      });

      const member = await tx.eventTeamMember.upsert({
        where: {
          eventId_userId: { eventId, userId }
        },
        update: { responsibility: 'Primary Student Coordinator' },
        create: { eventId, userId, responsibility: 'Primary Student Coordinator' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });
      return member;
    });
  }

  static async assignFacultyCoordinator(tenantId: string, eventId: string, userId: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found" };
    }

    const orgMember = await prisma.organizationMember.findFirst({
      where: { userId, organizationId: tenantId, role: { name: 'Faculty Coordinator' } }
    });

    if (!orgMember) {
      throw { status: 403, code: "FORBIDDEN", message: "User is not a valid Faculty Coordinator in this organization." };
    }

    return prisma.$transaction(async (tx) => {
      // Remove existing Faculty Coordinator if any
      await tx.eventTeamMember.deleteMany({
        where: { eventId, responsibility: 'Faculty Coordinator' }
      });

      const member = await tx.eventTeamMember.upsert({
        where: {
          eventId_userId: { eventId, userId }
        },
        update: { responsibility: 'Faculty Coordinator' },
        create: { eventId, userId, responsibility: 'Faculty Coordinator' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      });
      return member;
    });
  }
}
