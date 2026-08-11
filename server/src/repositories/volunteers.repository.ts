import { prisma } from "../utils/prisma";

export class VolunteerRepository {
  static async findAll(tenantId: string) {
    return prisma.volunteer.findMany({
      where: { organizationId: tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        eventAssignments: {
          include: {
            event: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.volunteer.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        eventAssignments: {
          include: {
            event: { select: { id: true, name: true, startTime: true, endTime: true } },
          },
        },
      },
    });
  }

  static async create(tenantId: string, data: { userId: string; role?: string; bio?: string }) {
    const member = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: data.userId, organizationId: tenantId } },
    });
    if (!member) throw new Error("User is not a member of this organization.");

    return prisma.volunteer.create({
      data: { userId: data.userId, organizationId: tenantId, role: data.role, bio: data.bio },
    });
  }

  static async update(tenantId: string, id: string, data: { role?: string; bio?: string }) {
    const volunteer = await this.findById(tenantId, id);
    if (!volunteer) return null;
    return prisma.volunteer.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const volunteer = await this.findById(tenantId, id);
    if (!volunteer) return null;
    return prisma.volunteer.delete({ where: { id } });
  }

  static async assignEvent(
    tenantId: string,
    volunteerId: string,
    eventId: string,
    shiftsCount?: number,
    hoursCount?: number
  ) {
    const volunteer = await this.findById(tenantId, volunteerId);
    if (!volunteer) throw new Error("Volunteer not found.");

    const event = await prisma.event.findFirst({
      where: { id: eventId, organizationId: tenantId },
    });
    if (!event) throw new Error("Event not found in this organization.");

    return prisma.volunteerEvent.create({
      data: { volunteerId, eventId, shiftsCount: shiftsCount ?? 0, hoursCount: hoursCount ?? 0 },
    });
  }

  static async removeEvent(tenantId: string, volunteerId: string, eventId: string) {
    const volunteer = await this.findById(tenantId, volunteerId);
    if (!volunteer) throw new Error("Volunteer not found.");
    return prisma.volunteerEvent.deleteMany({ where: { volunteerId, eventId } });
  }
}
