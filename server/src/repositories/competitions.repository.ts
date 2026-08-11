import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class CompetitionRepository {
  static async findAll(tenantId: string) {
    return prisma.competition.findMany({
      where: { event: { organizationId: tenantId } },
      include: { event: { select: { name: true } }, _count: { select: { teams: true, submissions: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.competition.findFirst({
      where: { id, event: { organizationId: tenantId } },
      include: { event: { select: { name: true } } }
    });
  }

  static async create(tenantId: string, data: Prisma.CompetitionUncheckedCreateInput) {
    // Verify the event belongs to this tenant
    const event = await prisma.event.findFirst({ where: { id: data.eventId, organizationId: tenantId } });
    if (!event) throw new Error("Invalid event ID");

    return prisma.competition.create({ data });
  }

  static async update(tenantId: string, id: string, data: Prisma.CompetitionUncheckedUpdateInput) {
    const comp = await this.findById(tenantId, id);
    if (!comp) return null;

    if (data.eventId) {
      const event = await prisma.event.findFirst({ where: { id: data.eventId as string, organizationId: tenantId } });
      if (!event) throw new Error("Invalid event ID");
    }

    return prisma.competition.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const comp = await this.findById(tenantId, id);
    if (!comp) return null;
    return prisma.competition.delete({ where: { id } });
  }
}
