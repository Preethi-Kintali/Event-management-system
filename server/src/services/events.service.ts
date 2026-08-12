import { EventRepository } from "../repositories/events.repository";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class EventService {
  static async getEvents(tenantId: string) {
    return EventRepository.findAll(tenantId);
  }

  static async getEvent(tenantId: string, id: string) {
    const event = await EventRepository.findById(tenantId, id);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return event;
  }

  static async createEvent(tenantId: string, data: any) {
    return EventRepository.create(tenantId, data);
  }

  static async updateEvent(tenantId: string, id: string, data: any) {
    const event = await EventRepository.update(tenantId, id, data);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return event;
  }

  static async deleteEvent(tenantId: string, id: string) {
    const event = await EventRepository.delete(tenantId, id);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return true;
  }

  static async getEventDashboard(tenantId: string, id: string) {
    const event = await prisma.event.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        registrations: true,
        competitions: {
          include: {
            teams: true,
            submissions: true,
          }
        }
      }
    });

    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }

    const registrations = event.registrations.length;
    let teams = 0;
    let submissions = 0;

    event.competitions.forEach(c => {
      teams += c.teams.length;
      submissions += c.submissions.length;
    });

    // Group registrations by month for the trend
    const monthMap: Record<string, number> = {};
    event.registrations.forEach(r => {
      const month = r.createdAt.toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    const registrationTrend = Object.keys(monthMap).map(month => ({
      month,
      registrations: monthMap[month],
      participants: 0 // Mock removed; pending real attendance calculation
    }));

    if (registrationTrend.length === 0) {
      registrationTrend.push({ month: "Current", registrations: 0, participants: 0 });
    }

    return {
      registrationTrend,
      metrics: {
        registrations,
        teams,
        submissions,
        revenue: 0, // Mock removed; revenue not tracked in schema currently
      }
    };
  }

  static async getEventSessions(tenantId: string, id: string) {
    const event = await prisma.event.findFirst({
      where: { id, organizationId: tenantId }
    });
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    const sessions = await prisma.attendanceSession.findMany({
      where: { eventId: id },
      orderBy: { startTime: 'asc' }
    });
    return sessions;
  }
}
