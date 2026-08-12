import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class SubmissionRepository {
  static async findAll(tenantId: string) {
    return prisma.submission.findMany({
      where: { competition: { event: { organizationId: tenantId } } },
      include: { 
        competition: { select: { name: true, event: { select: { name: true } } } },
        team: { select: { name: true } },
        _count: { select: { evaluations: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.submission.findFirst({
      where: { id, competition: { event: { organizationId: tenantId } } },
      include: { 
        competition: { select: { name: true, event: { select: { name: true } } } },
        team: { select: { name: true, members: { select: { user: { select: { firstName: true, lastName: true } } } } } },
        evaluations: {
          include: {
            judge: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });
  }

  static async create(tenantId: string, data: Prisma.SubmissionUncheckedCreateInput) {
    const comp = await prisma.competition.findFirst({ 
      where: { id: data.competitionId, event: { organizationId: tenantId } } 
    });
    if (!comp) throw new Error("Invalid competition ID");

    const team = await prisma.team.findFirst({
      where: { id: data.teamId as string, competitionId: data.competitionId }
    });
    if (!team) throw new Error("Invalid team ID");

    return prisma.submission.create({ data });
  }

  static async update(tenantId: string, id: string, data: Prisma.SubmissionUncheckedUpdateInput) {
    const sub = await this.findById(tenantId, id);
    if (!sub) return null;

    if (data.competitionId) {
      const comp = await prisma.competition.findFirst({ 
        where: { id: data.competitionId as string, event: { organizationId: tenantId } } 
      });
      if (!comp) throw new Error("Invalid competition ID");
    }

    return prisma.submission.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const sub = await this.findById(tenantId, id);
    if (!sub) return null;
    return prisma.submission.delete({ where: { id } });
  }
}
