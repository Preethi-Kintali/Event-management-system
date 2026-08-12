import { prisma } from "../utils/prisma";

export class SecurityRepository {
  static async getSecurityPolicy(tenantId: string) {
    let policy = await prisma.organizationSecurityPolicy.findUnique({
      where: { organizationId: tenantId }
    });

    if (!policy) {
      policy = await prisma.organizationSecurityPolicy.create({
        data: { organizationId: tenantId }
      });
    }

    return policy;
  }

  static async updateSecurityPolicy(tenantId: string, data: any) {
    return prisma.organizationSecurityPolicy.upsert({
      where: { organizationId: tenantId },
      update: data,
      create: { ...data, organizationId: tenantId }
    });
  }

  static async getActiveSessions(tenantId: string) {
    return prisma.userSession.findMany({
      where: {
        user: { memberships: { some: { organizationId: tenantId } } },
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { loginTime: 'desc' }
    });
  }

  static async revokeSession(tenantId: string, sessionId: string) {
    return prisma.userSession.updateMany({
      where: {
        id: sessionId,
        user: { memberships: { some: { organizationId: tenantId } } }
      },
      data: { revokedAt: new Date() }
    });
  }

  static async revokeAllOtherSessions(tenantId: string, userId: string, keepSessionId: string) {
    return prisma.userSession.updateMany({
      where: {
        userId,
        id: { not: keepSessionId },
        user: { memberships: { some: { organizationId: tenantId } } },
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });
  }

  static async getSecurityEvents(tenantId: string) {
    return prisma.securityEvent.findMany({
      where: { organizationId: tenantId },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  static async logSecurityEvent(tenantId: string, userId: string | null, event: string, severity: string, ipAddress: string | null = null, device: string | null = null, status: string = 'Success') {
    return prisma.securityEvent.create({
      data: {
        organizationId: tenantId,
        userId,
        event,
        severity,
        ipAddress,
        device,
        status
      }
    });
  }

  static async getSecurityDashboardMetrics(tenantId: string) {
    const activeSessions = await prisma.userSession.count({
      where: {
        user: { memberships: { some: { organizationId: tenantId } } },
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    const failedLogins24h = await prisma.securityEvent.count({
      where: {
        organizationId: tenantId,
        event: 'User Login',
        status: 'Failed',
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    const suspiciousActivities = await prisma.securityEvent.count({
      where: {
        organizationId: tenantId,
        severity: { in: ['High', 'Critical'] },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    const criticalAlerts = await prisma.securityEvent.count({
      where: {
        organizationId: tenantId,
        severity: 'Critical'
      }
    });

    // Basic scoring algorithm based on MFA enabled
    const policy = await this.getSecurityPolicy(tenantId);
    let securityScore = 50;
    if (policy.mfaEnabled) securityScore += 20;
    if (policy.mfaRequiredForAdmins) securityScore += 15;
    if (policy.minPasswordLength >= 12) securityScore += 10;
    if (policy.ssoEnabled) securityScore += 5;

    return {
      securityScore,
      activeSessions,
      mfaAdoptionPct: policy.mfaEnabled ? 100 : 0, // Placeholder as we don't have user-level MFA tracking yet
      failedLogins24h,
      suspiciousActivities,
      criticalAlerts
    };
  }
}
