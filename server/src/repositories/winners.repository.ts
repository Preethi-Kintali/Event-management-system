import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class WinnersRepository {
  static async findMany(
    organizationId: string,
    filters?: {
      competitionId?: string;
      status?: string;
    }
  ) {
    const where: Prisma.WinnerWhereInput = { organizationId };
    
    if (filters?.competitionId) where.competitionId = filters.competitionId;
    if (filters?.status) where.status = filters.status;

    return prisma.winner.findMany({
      where,
      include: {
        competition: { select: { id: true, name: true, event: { select: { id: true, name: true } } } },
        team: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        prize: true,
        submission: { select: { id: true, title: true } },
        selector: { select: { id: true, firstName: true, lastName: true, email: true } }
      },
      orderBy: { position: 'asc' }
    });
  }

  static async findById(id: string, organizationId: string) {
    return prisma.winner.findUnique({
      where: { id_organizationId: { id, organizationId } } as any, // Not compound unique, so we use findFirst
    });
  }
  
  static async findFirst(id: string, organizationId: string) {
    return prisma.winner.findFirst({
      where: { id, organizationId },
      include: {
        competition: true,
        submission: true,
        team: true,
        user: true,
        prize: true
      }
    });
  }

  static async create(data: Prisma.WinnerUncheckedCreateInput) {
    return prisma.winner.create({
      data,
      include: {
        competition: true,
        submission: true,
        team: true,
        user: true,
        prize: true
      }
    });
  }

  static async update(id: string, organizationId: string, data: Prisma.WinnerUpdateInput) {
    // Ensure the record belongs to the organization
    const existing = await this.findFirst(id, organizationId);
    if (!existing) throw new Error("Winner not found");

    return prisma.winner.update({
      where: { id },
      data,
      include: {
        competition: true,
        submission: true,
        team: true,
        user: true,
        prize: true
      }
    });
  }

  static async getPrizes(organizationId: string, competitionId?: string) {
    const where: Prisma.PrizeWhereInput = { organizationId };
    if (competitionId) where.competitionId = competitionId;
    
    return prisma.prize.findMany({
      where,
      include: {
        competition: { select: { id: true, name: true } }
      },
      orderBy: { position: 'asc' }
    });
  }

  static async getDashboardMetrics(organizationId: string) {
    const totalWinners = await prisma.winner.count({ where: { organizationId } });
    const finalizedCompetitions = await prisma.winner.groupBy({
      by: ['competitionId'],
      where: { organizationId, status: 'FINALIZED' }
    });
    const prizes = await prisma.prize.aggregate({
      where: { organizationId, status: 'PENDING' },
      _sum: { value: true }
    });
    
    return {
      totalWinners,
      finalizedCompetitions: finalizedCompetitions.length,
      pendingPrizeValue: prizes._sum.value || 0
    };
  }
}
