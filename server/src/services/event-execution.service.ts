import { prisma } from "../utils/prisma";
import { EventStatus, NotificationType } from "@prisma/client";

export class EventExecutionService {
  /**
   * Aggregates execution statistics for a specific event
   */
  static async getExecutionSummary(tenantId: string, eventId: string, onlyAssignedUserId?: string) {
    const whereClause: any = { id: eventId, organizationId: tenantId };
    if (onlyAssignedUserId) {
      whereClause.OR = [
        { teamMembers: { some: { userId: onlyAssignedUserId } } },
        { proposal: { submittedById: onlyAssignedUserId } }
      ];
    }

    // Verify event exists and belongs to tenant
    const event = await prisma.event.findFirst({
      where: whereClause,
      include: {
        registrations: true,
        attendanceSessions: {
          include: {
            records: true,
          },
        },
        competitions: {
          include: {
            teams: true,
            submissions: true,
            winners: true,
          },
        },
        volunteerEvents: true,
      },
    });

    if (!event) {
      throw new Error("Event not found or access denied");
    }

    // Registrations
    const totalRegistered = event.registrations.length;
    const approvedParticipants = event.registrations.filter(r => r.status === "APPROVED").length;
    const paidParticipants = event.registrations.filter(r => r.status === "PAID").length;

    // Attendance
    const totalAttendanceSessions = event.attendanceSessions.length;
    
    // Calculate unique attendees by extracting userId from all records across all sessions
    const allAttendanceRecords = event.attendanceSessions.flatMap(s => s.records);
    const uniqueAttendeeIds = new Set(allAttendanceRecords.map(r => r.userId));
    const uniqueAttendees = uniqueAttendeeIds.size;
    
    const attendancePercentage = totalRegistered > 0 
      ? Math.round((uniqueAttendees / totalRegistered) * 100) 
      : 0;

    // Competitions
    const totalCompetitions = event.competitions.length;
    const totalTeams = event.competitions.reduce((sum, comp) => sum + comp.teams.length, 0);
    const totalSubmissions = event.competitions.reduce((sum, comp) => sum + comp.submissions.length, 0);
    const totalWinners = event.competitions.reduce((sum, comp) => sum + comp.winners.length, 0);

    // Volunteers
    const totalVolunteers = event.volunteerEvents.length;
    const totalVolunteerHours = event.volunteerEvents.reduce((sum, vEvent) => sum + vEvent.hoursCount, 0);

    return {
      eventId: event.id,
      eventName: event.name,
      status: event.status,
      registrations: {
        totalRegistered,
        approvedParticipants,
        paidParticipants
      },
      attendance: {
        totalAttendanceSessions,
        uniqueAttendees,
        attendancePercentage
      },
      competition: {
        totalCompetitions,
        totalTeams,
        totalSubmissions,
        totalWinners
      },
      volunteers: {
        totalVolunteers,
        totalVolunteerHours
      }
    };
  }

  /**
   * Securely validates and marks an event as COMPLETED
   */
  static async completeEvent(tenantId: string, eventId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Verify event
      const event = await tx.event.findFirst({
        where: {
          id: eventId,
          organizationId: tenantId,
        },
        include: {
          competitions: {
            include: {
              winners: true,
            },
          },
          proposal: true,
        },
      });

      if (!event) {
        throw new Error("Event not found or access denied");
      }

      // 2. Status validation
      if (event.status === EventStatus.COMPLETED) {
        throw new Error("Event is already completed");
      }
      if (event.status === EventStatus.CANCELLED) {
        throw new Error("Cannot complete a cancelled event");
      }
      if (event.status !== EventStatus.LIVE) {
        throw new Error("Only LIVE events can be completed");
      }

      // 3. Verify winners if competitions exist
      if (event.competitions.length > 0) {
        for (const comp of event.competitions) {
          if (comp.winners.length === 0) {
            throw new Error(`Competition "${comp.name}" requires winners before event completion.`);
          }
        }
      }

      // 4. Update Event Status
      const updatedEvent = await tx.event.update({
        where: { id: event.id },
        data: {
          status: EventStatus.COMPLETED,
        },
      });

      // 5. Notifications
      const notificationRecipients: string[] = [];
      
      // If there's a linked proposal, notify the submitter and manager/principal
      if (event.proposal) {
        notificationRecipients.push(event.proposal.submittedById);
        if (event.proposal.managerId) notificationRecipients.push(event.proposal.managerId);
        if (event.proposal.principalId) notificationRecipients.push(event.proposal.principalId);
      }

      const uniqueRecipients = [...new Set(notificationRecipients)];

      if (uniqueRecipients.length > 0) {
        await tx.notification.createMany({
          data: uniqueRecipients.map((userId) => ({
            organizationId: tenantId,
            recipientUserId: userId,
            title: "Event Completed",
            message: `The event "${event.name}" has been successfully completed and execution data is locked.`,
            type: NotificationType.EVENT,
          })),
        });
      }

      return updatedEvent;
    });
  }
}
