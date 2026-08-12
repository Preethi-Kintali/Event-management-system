import { BadgesRepository } from "../repositories/badges.repository";
import { prisma } from "../utils/prisma";
import { AuditService } from "./audit.service";
import { NotificationService } from "./notifications.service";

export class BadgesService {
  static async getBadges(organizationId: string) {
    return BadgesRepository.findManyBadges(organizationId);
  }

  static async getBadgeById(id: string, organizationId: string) {
    const badge = await BadgesRepository.findBadgeById(id, organizationId);
    if (!badge) throw new Error("Badge not found");
    return badge;
  }

  static async createBadge(
    organizationId: string,
    data: { name: string; description?: string; icon?: string; type: string; criteria?: string },
    actorId: string
  ) {
    const badge = await BadgesRepository.createBadge({
      organizationId,
      ...data,
      status: "ACTIVE"
    });

    await AuditService.log({
      organizationId,
      actorId,
      action: "badge.created",
      target: badge.id
    });

    return badge;
  }

  static async awardBadge(
    organizationId: string,
    data: { badgeId: string; recipientUserId: string; reason?: string },
    actorId: string
  ) {
    // Prevent duplicate award
    const existing = await prisma.badgeAward.findFirst({
      where: {
        badgeId: data.badgeId,
        recipientUserId: data.recipientUserId
      }
    });

    if (existing) {
      if (existing.revokedAt) {
        throw new Error("Badge was previously revoked for this user. Implement explicit re-award if needed.");
      }
      throw new Error("User already possesses this badge");
    }

    const award = await BadgesRepository.createAward({
      organizationId,
      badgeId: data.badgeId,
      recipientUserId: data.recipientUserId,
      reason: data.reason,
      awardedBy: actorId
    });

    await AuditService.log({
      organizationId,
      actorId,
      action: "badge.awarded",
      target: award.id,
      metadata: { badgeId: data.badgeId, recipientUserId: data.recipientUserId }
    });

    await NotificationService.create({
      organizationId,
      recipientUserId: data.recipientUserId,
      title: "New Badge Earned",
      message: `Congratulations! You earned the ${award.badge.name} badge.`,
      type: "SYSTEM"
    });

    return award;
  }

  static async revokeAward(id: string, organizationId: string, actorId: string) {
    await BadgesRepository.revokeAward(id, organizationId);
    await AuditService.log({
      organizationId,
      actorId,
      action: "badge.revoked",
      target: id
    });
    return { success: true };
  }

  static async getAchievements(organizationId: string) {
    return BadgesRepository.findManyAchievements(organizationId);
  }

  static async getDashboard(organizationId: string) {
    return BadgesRepository.getDashboardMetrics(organizationId);
  }
}
