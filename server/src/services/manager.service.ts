import { prisma } from "../utils/prisma";

export class ManagerService {
  static async getDashboardStats(organizationId: string) {
    const totalEvents = await prisma.event.count({
      where: { organizationId }
    });

    const activeTeams = await prisma.team.count({
      where: { competition: { event: { organizationId } } }
    });

    const pendingEvaluations = await prisma.evaluation.count({
      where: { 
        submission: { competition: { event: { organizationId } } },
        status: 'PENDING'
      }
    });
    
    const upcomingEvents = await prisma.event.findMany({
      where: { organizationId, startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
      take: 5
    });
    
    const recentActivity = await prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      totalEvents,
      activeTeams,
      pendingEvaluations,
      upcomingEvents,
      recentActivity
    };
  }
}
