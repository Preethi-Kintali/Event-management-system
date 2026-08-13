import { prisma } from "../utils/prisma";

export const PlatformAdminService = {
  async getSummary() {
    const totalOrganizations = await prisma.organization.count();
    const activeOrganizations = await prisma.organization.count({
      where: { status: "ACTIVE" },
    });
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { status: "ACTIVE" },
    });
    
    const activeEvents = await prisma.event.count({
      where: { status: "LIVE" },
    });

    const successfulPayments = await prisma.payment.findMany({
      where: { status: "SUCCEEDED" },
    });
    
    // Revenue logic: just sum all SUCCEEDED payments
    const platformRevenue = successfulPayments.reduce((acc, curr) => acc + curr.amount, 0);

    // Subscription Revenue logic
    const subscriptionRevenue = platformRevenue * 0.8; // Approximation since line items are not perfectly split

    const apiUsage = await prisma.auditLog.count();

    return {
      totalOrganizations,
      activeOrganizations,
      totalUsers,
      activeUsers,
      activeEvents,
      platformRevenue,
      subscriptionRevenue,
      storageUsage: 0,
      apiUsage,
    };
  },

  async getTimeline() {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { actor: true, organization: true }
    });

    return logs.map((log, index) => ({
      id: `tl_${log.id}`,
      title: `${log.action} performed`,
      description: `Action ${log.action} performed by ${log.actor.firstName || log.actor.email} in ${log.organization.name}.`,
      time: log.createdAt.toISOString(),
      type: index === 0 ? "primary" : "default"
    }));
  },

  async getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        organization: true,
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Manually calculate used seats by checking user count per org
    const orgIds = subscriptions.map(s => s.organizationId);
    const members = await prisma.organizationMember.groupBy({
      by: ['organizationId'],
      _count: { userId: true },
      where: { organizationId: { in: orgIds } }
    });
    const membersMap = new Map(members.map(m => [m.organizationId, m._count.userId]));

    return subscriptions.map(sub => ({
      id: sub.id,
      org: sub.organization.name,
      type: sub.plan.name,
      seats: sub.plan.features ? (sub.plan.features as any).maxUsers || 10 : 10,
      usedSeats: membersMap.get(sub.organizationId) || 0,
      startDate: sub.currentPeriodStart.toISOString(),
      expiryDate: sub.currentPeriodEnd.toISOString(),
      status: sub.status,
    }));
  },

  async getAuditLogs() {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { actor: true }
    });

    return logs.map((log) => ({
      id: log.id,
      actor: log.actor.email || log.actorId,
      action: log.action,
      target: log.target || "system",
      ip: "127.0.0.1", // Mock IP for now, we'd pull from req if stored
      severity: "info", // Mock severity
      timestamp: log.createdAt.toISOString(),
    }));
  }
};
