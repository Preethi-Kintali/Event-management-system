import { prisma } from "../utils/prisma";

export interface AuditLogData {
  organizationId: string;
  actorId: string;
  action: string;
  target?: string;
  metadata?: any;
}

export class AuditService {
  /**
   * Records an action in the audit log securely.
   * Does not log sensitive secrets.
   */
  static async logAction(data: AuditLogData) {
    try {
      // Strip any sensitive fields blindly just in case they slipped into metadata
      let safeMetadata = data.metadata;
      if (safeMetadata && typeof safeMetadata === 'object') {
        const { password, passwordHash, token, secret, ...rest } = safeMetadata;
        safeMetadata = rest;
      }

      await prisma.auditLog.create({
        data: {
          organizationId: data.organizationId,
          actorId: data.actorId,
          action: data.action,
          target: data.target,
          metadata: safeMetadata || null,
        }
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
      // We don't throw here to avoid failing the main request if auditing fails.
    }
  }
}
