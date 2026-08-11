import { CertificateRepository } from "../repositories/certificates.repository";
import { AuditService } from "./audit.service";
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
    const certificateNumber = `CERT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    const cert = await CertificateRepository.create(tenantId, {
      ...data,
      certificateNumber,
      verificationCode,
    });

    await AuditService.log({
      tenantId,
      actorId,
      action: "certificate.create",
      target: cert.id,
      metadata: { type: cert.type, certificateNumber }
    });

    return cert;
  }

  static async update(tenantId: string, actorId: string, id: string, data: Prisma.CertificateUncheckedUpdateInput) {
    const cert = await CertificateRepository.update(tenantId, id, data);
    if (cert) {
      await AuditService.log({
        tenantId,
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

    await AuditService.log({
      tenantId,
      actorId,
      action: "certificate.issue",
      target: eventId,
      metadata: { type, count: result.count }
    });

    return result;
  }

  static async revoke(tenantId: string, actorId: string, id: string) {
    const cert = await CertificateRepository.update(tenantId, id, { status: 'REVOKED' });
    if (cert) {
      await AuditService.log({
        tenantId,
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
      await AuditService.log({
        tenantId,
        actorId,
        action: "certificate.delete",
        target: cert.id,
        metadata: { certificateNumber: cert.certificateNumber }
      });
    }
    return cert;
  }
}
