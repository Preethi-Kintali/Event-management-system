import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class OrganizationRepository {
  static async findAll() {
    return prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id }
    });
  }

  static async create(data: Prisma.OrganizationUncheckedCreateInput) {
    return prisma.organization.create({ data });
  }

  static async update(id: string, data: Prisma.OrganizationUncheckedUpdateInput) {
    return prisma.organization.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.organization.delete({ where: { id } });
  }

  // Member Management
  static async findMembers(orgId: string) {
    return prisma.organizationMember.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, role: true }
    });
  }

  static async findMember(orgId: string, memberId: string) {
    return prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });
  }

  static async addMember(orgId: string, userId: string, roleId: string) {
    return prisma.organizationMember.create({
      data: {
        organizationId: orgId,
        userId,
        roleId,
        status: "ACTIVE" // Auto active for now
      }
    });
  }

  static async updateMember(memberId: string, data: Prisma.OrganizationMemberUncheckedUpdateInput) {
    return prisma.organizationMember.update({
      where: { id: memberId },
      data
    });
  }

  static async removeMember(memberId: string) {
    return prisma.organizationMember.delete({ where: { id: memberId } });
  }
}
