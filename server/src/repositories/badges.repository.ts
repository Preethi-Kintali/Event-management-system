import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class BadgesRepository {
  // Badges
  static async findManyBadges(organizationId: string) {
    return prisma.badge.findMany({
      where: { organizationId },
      include: {
        _count: { select: { awards: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findBadgeById(id: string, organizationId: string) {
    return prisma.badge.findFirst({
      where: { id, organizationId },
      include: {
        awards: {
          include: {
            recipient: { select: { id: true, firstName: true, lastName: true, email: true } },
            awarder: { select: { id: true, firstName: true, lastName: true, email: true } }
          },
          orderBy: { awardedAt: 'desc' }
        }
      }
    });
  }

  static async createBadge(data: Prisma.BadgeUncheckedCreateInput) {
    return prisma.badge.create({ data });
  }

  static async updateBadge(id: string, organizationId: string, data: Prisma.BadgeUpdateInput) {
    const existing = await prisma.badge.findFirst({ where: { id, organizationId } });
    if (!existing) throw new Error("Badge not found");
    
    return prisma.badge.update({
      where: { id },
      data
    });
  }

  // Awards
  static async createAward(data: Prisma.BadgeAwardUncheckedCreateInput) {
    return prisma.badgeAward.create({
      data,
      include: {
        badge: true,
        recipient: true
      }
    });
  }

  static async revokeAward(id: string, organizationId: string) {
    return prisma.badgeAward.updateMany({
      where: { id, organizationId },
      data: { revokedAt: new Date() }
    });
  }

  // Achievements
  static async findManyAchievements(organizationId: string) {
    return prisma.achievement.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Dashboard
  static async getDashboardMetrics(organizationId: string) {
    const totalBadges = await prisma.badge.count({ where: { organizationId } });
    const activeBadges = await prisma.badge.count({ where: { organizationId, status: 'ACTIVE' } });
    const totalAwards = await prisma.badgeAward.count({ where: { organizationId, revokedAt: null } });
    
    // Top achievers (users with most badges)
    const awardsGrouped = await prisma.badgeAward.groupBy({
      by: ['recipientUserId'],
      where: { organizationId, revokedAt: null },
      _count: { badgeId: true },
      orderBy: { _count: { badgeId: 'desc' } },
      take: 5
    });

    const topAchievers = await Promise.all(
      awardsGrouped.map(async (a) => {
        const user = await prisma.user.findUnique({ where: { id: a.recipientUserId }, select: { id: true, firstName: true, lastName: true, email: true } });
        return { user, count: a._count.badgeId };
      })
    );

    return {
      totalBadges,
      activeBadges,
      totalAwards,
      topAchievers
    };
  }
}
