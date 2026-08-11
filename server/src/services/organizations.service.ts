import { OrganizationRepository } from "../repositories/organizations.repository";
import { AuditService } from "./audit.service";
import { prisma } from "../utils/prisma";

export class OrganizationService {
  static async getAll() {
    return OrganizationRepository.findAll();
  }

  static async getById(id: string) {
    const org = await OrganizationRepository.findById(id);
    if (!org) throw { status: 404, code: "NOT_FOUND", message: "Organization not found" };
    return org;
  }

  static async create(data: any, actorId: string) {
    const existing = await prisma.organization.findUnique({ where: { slug: data.slug } });
    if (existing) throw { status: 400, code: "SLUG_IN_USE", message: "Organization slug already in use" };

    const org = await OrganizationRepository.create(data);
    await AuditService.logAction({
      organizationId: org.id,
      actorId,
      action: "organization.created",
      target: org.id,
      metadata: data
    });
    return org;
  }

  static async update(id: string, data: any, actorId: string) {
    const org = await this.getById(id); // validates existence
    const updated = await OrganizationRepository.update(id, data);
    await AuditService.logAction({
      organizationId: id,
      actorId,
      action: "organization.updated",
      target: id,
      metadata: data
    });
    return updated;
  }

  static async delete(id: string, actorId: string) {
    await this.getById(id);
    await OrganizationRepository.delete(id);
    await AuditService.logAction({ organizationId: id, actorId, action: "organization.deleted", target: id });
    return true;
  }

  // Members
  static async getMembers(orgId: string) {
    return OrganizationRepository.findMembers(orgId);
  }

  static async addMember(orgId: string, email: string, roleId: string, actorId: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found with this email" };

    const existingMembership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: user.id, organizationId: orgId } }
    });
    if (existingMembership) throw { status: 400, code: "ALREADY_MEMBER", message: "User is already a member of this organization" };

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw { status: 404, code: "NOT_FOUND", message: "Role not found" };

    if (role.organizationId && role.organizationId !== orgId) {
      throw { status: 400, code: "INVALID_ROLE", message: "Role belongs to a different organization" };
    }

    const member = await OrganizationRepository.addMember(orgId, user.id, role.id);
    await AuditService.logAction({ organizationId: orgId, actorId, action: "member.added", target: member.id, metadata: { email, roleId } });
    return member;
  }

  static async updateMember(orgId: string, memberId: string, data: any, actorId: string) {
    const member = await OrganizationRepository.findMember(orgId, memberId);
    if (!member || member.organizationId !== orgId) {
      throw { status: 404, code: "NOT_FOUND", message: "Member not found in this organization" };
    }

    if (data.roleId) {
      const role = await prisma.role.findUnique({ where: { id: data.roleId } });
      if (!role) throw { status: 404, code: "NOT_FOUND", message: "Role not found" };
      if (role.organizationId && role.organizationId !== orgId) {
        throw { status: 400, code: "INVALID_ROLE", message: "Role belongs to a different organization" };
      }
    }

    const updated = await OrganizationRepository.updateMember(memberId, data);
    await AuditService.logAction({ organizationId: orgId, actorId, action: "member.updated", target: memberId, metadata: data });
    return updated;
  }

  static async removeMember(orgId: string, memberId: string, actorId: string) {
    const member = await OrganizationRepository.findMember(orgId, memberId);
    if (!member || member.organizationId !== orgId) {
      throw { status: 404, code: "NOT_FOUND", message: "Member not found in this organization" };
    }

    // Check if removing the last organization admin
    const isAdmin = member.role.permissions.some(p => p.permission.action === "organization.manage");
    if (isAdmin) {
      const otherAdmins = await prisma.organizationMember.count({
        where: {
          organizationId: orgId,
          id: { not: memberId },
          status: "ACTIVE",
          role: { permissions: { some: { permission: { action: "organization.manage" } } } }
        }
      });
      if (otherAdmins === 0) {
        throw { status: 400, code: "LAST_ADMIN", message: "Cannot remove the last organization administrator" };
      }
    }

    await OrganizationRepository.removeMember(memberId);
    await AuditService.logAction({ organizationId: orgId, actorId, action: "member.removed", target: memberId });
    return true;
  }
}
