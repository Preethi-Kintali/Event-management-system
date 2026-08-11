import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class TeamRepository {
  static async findAll(tenantId: string) {
    return prisma.team.findMany({
      where: { competition: { event: { organizationId: tenantId } } },
      include: { 
        competition: { select: { name: true, event: { select: { name: true } } } },
        _count: { select: { members: true, submissions: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.team.findFirst({
      where: { id, competition: { event: { organizationId: tenantId } } },
      include: { 
        competition: { select: { name: true, event: { select: { name: true } } } },
        members: { include: { user: { select: { firstName: true, lastName: true, email: true } } } }
      }
    });
  }

  static async create(tenantId: string, data: Prisma.TeamUncheckedCreateInput) {
    const comp = await prisma.competition.findFirst({ 
      where: { id: data.competitionId, event: { organizationId: tenantId } } 
    });
    if (!comp) throw new Error("Invalid competition ID");

    return prisma.team.create({ data });
  }

  static async update(tenantId: string, id: string, data: Prisma.TeamUncheckedUpdateInput) {
    const team = await this.findById(tenantId, id);
    if (!team) return null;

    if (data.competitionId) {
      const comp = await prisma.competition.findFirst({ 
        where: { id: data.competitionId as string, event: { organizationId: tenantId } } 
      });
      if (!comp) throw new Error("Invalid competition ID");
    }

    return prisma.team.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const team = await this.findById(tenantId, id);
    if (!team) return null;
    return prisma.team.delete({ where: { id } });
  }
}
