import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class CertificateRepository {
  static async findAll(tenantId: string) {
    return prisma.certificate.findMany({
      where: { organizationId: tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: { select: { id: true, name: true } },
        competition: { select: { id: true, name: true } }
      },
      orderBy: { issuedAt: 'desc' }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.certificate.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: { select: { id: true, name: true } },
        competition: { select: { id: true, name: true } }
      }
    });
  }

  static async findByVerificationCode(code: string) {
    return prisma.certificate.findUnique({
      where: { verificationCode: code },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: { select: { id: true, name: true } },
        competition: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true } }
      }
    });
  }

  static async create(tenantId: string, data: Prisma.CertificateUncheckedCreateInput) {
    return prisma.certificate.create({
      data: {
        ...data,
        organizationId: tenantId
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: { select: { id: true, name: true } }
      }
    });
  }

  static async createMany(data: Prisma.CertificateCreateManyInput[]) {
    return prisma.certificate.createMany({
      data,
      skipDuplicates: true
    });
  }

  static async update(tenantId: string, id: string, data: Prisma.CertificateUncheckedUpdateInput) {
    const cert = await this.findById(tenantId, id);
    if (!cert) return null;

    return prisma.certificate.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: { select: { id: true, name: true } }
      }
    });
  }

  static async delete(tenantId: string, id: string) {
    const cert = await this.findById(tenantId, id);
    if (!cert) return null;

    return prisma.certificate.delete({
      where: { id }
    });
  }
}
