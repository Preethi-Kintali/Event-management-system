import { prisma } from "../utils/prisma";

export class CommunicationRepository {
  static async findAll(orgId: string, { page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.communication.findMany({
        where: { organizationId: orgId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { creator: { select: { firstName: true, lastName: true, email: true } } }
      }),
      prisma.communication.count({ where: { organizationId: orgId } })
    ]);
    return { data, total, page, limit };
  }

  static async findById(id: string, orgId: string) {
    return prisma.communication.findUnique({
      where: { id, organizationId: orgId },
      include: { creator: { select: { firstName: true, lastName: true, email: true } } }
    });
  }

  static async create(orgId: string, data: any) {
    return prisma.communication.create({
      data: {
        ...data,
        organizationId: orgId,
      }
    });
  }

  static async update(id: string, orgId: string, data: any) {
    return prisma.communication.update({
      where: { id, organizationId: orgId },
      data
    });
  }

  static async delete(id: string, orgId: string) {
    return prisma.communication.delete({
      where: { id, organizationId: orgId }
    });
  }

  static async getDashboardMetrics(orgId: string) {
    const stats = await prisma.communication.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: { _all: true }
    });

    let scheduled = 0;
    let published = 0;
    let draft = 0;
    let archived = 0;

    stats.forEach(s => {
      if (s.status === 'SCHEDULED') scheduled = s._count._all;
      if (s.status === 'PUBLISHED') published = s._count._all;
      if (s.status === 'DRAFT') draft = s._count._all;
      if (s.status === 'ARCHIVED') archived = s._count._all;
    });

    const total = scheduled + published + draft + archived;

    return {
      messagesSent: total,
      delivered: published,
      failed: 0,
      scheduled: scheduled,
      openRate: 64.2, // Stub for now
      clickRate: 18.5, // Stub for now
    };
  }
}
