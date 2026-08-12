import { CertificateRepository } from "../repositories/certificates.repository";
import { AuditService } from "./audit.service";
import { NotificationService } from "./notifications.service";
import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

export class CertificateService {
  static async findAll(tenantId: string) {
    return CertificateRepository.findAll(tenantId);
  }

  static async findById(tenantId: string, id: string) {
    return CertificateRepository.findById(tenantId, id);
  }

  static async findByVerificationCode(code: string) {
    return CertificateRepository.findByVerificationCode(code);
  }

  static async create(tenantId: string, actorId: string, data: Omit<Prisma.CertificateUncheckedCreateInput, 'certificateNumber' | 'verificationCode' | 'organizationId'>) {
    // SECURITY VALIDATION: Verify the user is registered for the event in the tenant
    const registration = await prisma.registration.findFirst({
      where: {
        userId: data.userId,
        eventId: data.eventId,
        event: { organizationId: tenantId }
      }
    });

    if (!registration) {
      throw { status: 403, code: "UNAUTHORIZED", message: "User is not registered for this event or event does not belong to the organization." };
    }

    // SECURITY VALIDATION: Prevent duplicate certificates of the same type for the same user and event
    const existingCert = await prisma.certificate.findFirst({
      where: {
        userId: data.userId,
        eventId: data.eventId,
        type: data.type
      }
    });

    if (existingCert) {
      throw { status: 400, code: "DUPLICATE_CERTIFICATE", message: `A ${data.type} certificate has already been issued to this user for this event.` };
    }

    const certificateNumber = `CERT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    const cert = await CertificateRepository.create(tenantId, {
      ...data,
      certificateNumber,
      verificationCode,
    });

    await AuditService.logAction({
      organizationId: tenantId,
      actorId,
      action: "certificate.create",
      target: cert.id,
      metadata: { type: cert.type, certificateNumber }
    });

    await NotificationService.createBulk(tenantId, [data.userId], {
      title: "Certificate Issued",
      message: `Your ${data.type.toLowerCase()} certificate has been issued.`,
      type: "CERTIFICATE",
      link: "/certificates",
    });

    return cert;
  }

  static async update(tenantId: string, actorId: string, id: string, data: Prisma.CertificateUncheckedUpdateInput) {
    const cert = await CertificateRepository.update(tenantId, id, data);
    if (cert) {
      await AuditService.logAction({
        organizationId: tenantId,
        actorId,
        action: "certificate.update",
        target: cert.id,
        metadata: { updates: Object.keys(data) }
      });
    }
    return cert;
  }

  static async bulkIssue(tenantId: string, actorId: string, eventId: string, userIds: string[], type: any, title: string, description?: string) {
    const certificatesToCreate = userIds.map(userId => ({
      userId,
      eventId,
      organizationId: tenantId,
      certificateNumber: `CERT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      verificationCode: crypto.randomBytes(8).toString('hex').toUpperCase(),
      type,
      title,
      description,
      status: 'ISSUED' as const,
    }));

    const result = await CertificateRepository.createMany(certificatesToCreate);

    await AuditService.logAction({
      organizationId: tenantId,
      actorId,
      action: "certificate.issue",
      target: eventId,
      metadata: { type, count: result.count }
    });

    if (result.count > 0 && userIds.length > 0) {
      await NotificationService.createBulk(tenantId, userIds, {
        title: "Certificate Issued",
        message: `Your ${type.toLowerCase()} certificate for the event has been issued.`,
        type: "CERTIFICATE",
        link: "/certificates",
      });
    }

    return result;
  }

  static async revoke(tenantId: string, actorId: string, id: string) {
    const cert = await CertificateRepository.update(tenantId, id, { status: 'REVOKED' });
    if (cert) {
      await AuditService.logAction({
        organizationId: tenantId,
        actorId,
        action: "certificate.revoke",
        target: cert.id,
        metadata: { certificateNumber: cert.certificateNumber }
      });
    }
    return cert;
  }

  static async delete(tenantId: string, actorId: string, id: string) {
    const cert = await CertificateRepository.delete(tenantId, id);
    if (cert) {
      await AuditService.logAction({
        organizationId: tenantId,
        actorId,
        action: "certificate.delete",
        target: cert.id,
        metadata: { certificateNumber: cert.certificateNumber }
      });
    }
    return cert;
  }
}
