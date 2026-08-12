import { CommunicationRepository } from "../repositories/communications.repository";
import { NotificationService } from "./notifications.service";
import { AuditService } from "./audit.service";
import { prisma } from "../utils/prisma";

export class CommunicationService {
  static async getAll(orgId: string, options: { page?: number; limit?: number }) {
    return CommunicationRepository.findAll(orgId, options);
  }

  static async getDashboardSummary(orgId: string) {
    return CommunicationRepository.getDashboardMetrics(orgId);
  }

  static async getById(id: string, orgId: string) {
    const comm = await CommunicationRepository.findById(id, orgId);
    if (!comm) throw { status: 404, code: "NOT_FOUND", message: "Communication not found" };
    return comm;
  }

  static async create(orgId: string, actorId: string, data: any) {
    const comm = await CommunicationRepository.create(orgId, {
      ...data,
      createdBy: actorId,
    });
    await AuditService.logAction({ organizationId: orgId, actorId, action: "communication.create", target: comm.id });
    return comm;
  }

  static async update(orgId: string, actorId: string, id: string, data: any) {
    const comm = await this.getById(id, orgId);
    if (comm.status !== "DRAFT" && comm.status !== "SCHEDULED") {
      throw { status: 400, code: "BAD_REQUEST", message: "Cannot edit a published or archived communication" };
    }
    const updated = await CommunicationRepository.update(id, orgId, data);
    await AuditService.logAction({ organizationId: orgId, actorId, action: "communication.update", target: id });
    return updated;
  }

  static async delete(orgId: string, actorId: string, id: string) {
    const comm = await this.getById(id, orgId);
    if (comm.status === "PUBLISHED") {
      throw { status: 400, code: "BAD_REQUEST", message: "Cannot delete a published communication. Archive it instead." };
    }
    await CommunicationRepository.delete(id, orgId);
    await AuditService.logAction({ organizationId: orgId, actorId, action: "communication.delete", target: id });
  }

  static async archive(orgId: string, actorId: string, id: string) {
    await this.getById(id, orgId);
    const updated = await CommunicationRepository.update(id, orgId, { status: "ARCHIVED" });
    await AuditService.logAction({ organizationId: orgId, actorId, action: "communication.archive", target: id });
    return updated;
  }

  static async publish(orgId: string, actorId: string, id: string) {
    const comm = await this.getById(id, orgId);
    if (comm.status === "PUBLISHED") {
      throw { status: 400, code: "BAD_REQUEST", message: "Communication is already published" };
    }

    const updated = await CommunicationRepository.update(id, orgId, { 
      status: "PUBLISHED", 
      publishedAt: new Date() 
    });

    await AuditService.logAction({ organizationId: orgId, actorId, action: "communication.publish", target: id });

    // Resolve audience
    const recipientIds = await this.resolveAudience(orgId, comm.audience);

    // Trigger Notification Service
    await NotificationService.createBulk(orgId, recipientIds, {
      title: comm.title,
      message: comm.type === "REMINDER" ? "Reminder: " + comm.title : "New Announcement: " + comm.title,
      type: "ANNOUNCEMENT",
      link: `/communications/${comm.id}`
    });

    return updated;
  }

  private static async resolveAudience(orgId: string, audience: string): Promise<string[]> {
    if (audience === "ALL") {
      const members = await prisma.organizationMember.findMany({
        where: { organizationId: orgId, status: "ACTIVE" },
        select: { userId: true }
      });
      return members.map(m => m.userId);
    }
    
    if (audience === "JUDGES") {
      const judges = await prisma.judge.findMany({
        where: { organizationId: orgId },
        select: { userId: true }
      });
      return judges.map(j => j.userId);
    }

    if (audience === "MENTORS") {
      const mentors = await prisma.mentor.findMany({
        where: { organizationId: orgId },
        select: { userId: true }
      });
      return mentors.map(m => m.userId);
    }
    
    if (audience === "VOLUNTEERS") {
      const vols = await prisma.volunteer.findMany({
        where: { organizationId: orgId },
        select: { userId: true }
      });
      return vols.map(v => v.userId);
    }

    if (audience.startsWith("EVENT:")) {
      const eventId = audience.split(":")[1];
      const regs = await prisma.registration.findMany({
        where: { eventId, event: { organizationId: orgId }, status: "APPROVED" },
        select: { userId: true }
      });
      return regs.map(r => r.userId);
    }

    return [];
  }
}
