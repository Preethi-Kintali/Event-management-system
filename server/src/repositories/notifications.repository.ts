import { prisma } from "../utils/prisma";

export class NotificationRepository {
  static async findAllForUser(userId: string, orgId: string, { page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;
    const [data, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientUserId: userId, organizationId: orgId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: { recipientUserId: userId, organizationId: orgId } }),
      prisma.notification.count({ where: { recipientUserId: userId, organizationId: orgId, isRead: false } }),
    ]);
    return { data, total, unreadCount, page, limit };
  }

  static async findById(id: string, userId: string, orgId: string) {
    return prisma.notification.findUnique({
      where: { id, recipientUserId: userId, organizationId: orgId },
    });
  }

  static async create(data: any) {
    return prisma.notification.create({
      data
    });
  }

  static async createBulk(data: any[]) {
    return prisma.notification.createMany({
      data
    });
  }

  static async markAsRead(id: string, userId: string, orgId: string) {
    return prisma.notification.update({
      where: { id, recipientUserId: userId, organizationId: orgId },
      data: { isRead: true, readAt: new Date() }
    });
  }

  static async markAllAsRead(userId: string, orgId: string) {
    return prisma.notification.updateMany({
      where: { recipientUserId: userId, organizationId: orgId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });
  }

  static async delete(id: string, userId: string, orgId: string) {
    return prisma.notification.delete({
      where: { id, recipientUserId: userId, organizationId: orgId }
    });
  }
}
