import { NotificationRepository } from "../repositories/notifications.repository";

export class NotificationService {
  static async getForUser(userId: string, orgId: string, options: { page?: number; limit?: number }) {
    return NotificationRepository.findAllForUser(userId, orgId, options);
  }

  static async markAsRead(id: string, userId: string, orgId: string) {
    const notif = await NotificationRepository.findById(id, userId, orgId);
    if (!notif) throw { status: 404, code: "NOT_FOUND", message: "Notification not found" };
    return NotificationRepository.markAsRead(id, userId, orgId);
  }

  static async markAllAsRead(userId: string, orgId: string) {
    return NotificationRepository.markAllAsRead(userId, orgId);
  }

  static async delete(id: string, userId: string, orgId: string) {
    const notif = await NotificationRepository.findById(id, userId, orgId);
    if (!notif) throw { status: 404, code: "NOT_FOUND", message: "Notification not found" };
    return NotificationRepository.delete(id, userId, orgId);
  }

  static async create(data: {
    organizationId: string;
    recipientUserId: string;
    title: string;
    message: string;
    type: "ANNOUNCEMENT" | "EVENT" | "REGISTRATION" | "TEAM" | "SUBMISSION" | "EVALUATION" | "CERTIFICATE" | "SYSTEM";
    link?: string;
  }) {
    return NotificationRepository.create(data);
  }

  static async createBulk(
    organizationId: string,
    recipientIds: string[],
    data: {
      title: string;
      message: string;
      type: "ANNOUNCEMENT" | "EVENT" | "REGISTRATION" | "TEAM" | "SUBMISSION" | "EVALUATION" | "CERTIFICATE" | "SYSTEM";
      link?: string;
    }
  ) {
    if (!recipientIds.length) return { count: 0 };
    
    const payloads = recipientIds.map(userId => ({
      organizationId,
      recipientUserId: userId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
      isRead: false
    }));

    return NotificationRepository.createBulk(payloads);
  }
}
