import { RoleRepository } from "../repositories/roles.repository";
import { AuditService } from "./audit.service";

export class RoleService {
  static async getAll(orgId?: string) {
    return RoleRepository.findAll(orgId);
  }

  static async getById(id: string) {
    const role = await RoleRepository.findById(id);
    if (!role) throw { status: 404, code: "NOT_FOUND", message: "Role not found" };
    return role;
  }

  static async create(orgId: string | null, data: any, actorId: string) {
    const role = await RoleRepository.create(orgId, data);
    await AuditService.logAction({ organizationId: orgId || "PLATFORM", actorId, action: "role.created", target: role!.id, metadata: data });
    return role;
  }

  static async update(orgId: string | null, id: string, data: any, actorId: string) {
    const role = await this.getById(id);
    if (orgId && role.organizationId !== orgId) {
      throw { status: 403, code: "FORBIDDEN", message: "Cannot modify a global role or role from another organization" };
    }
    const updated = await RoleRepository.update(id, data);
    await AuditService.logAction({ organizationId: orgId || "PLATFORM", actorId, action: "role.updated", target: id, metadata: data });
    return updated;
  }

  static async delete(orgId: string | null, id: string, actorId: string) {
    const role = await this.getById(id);
    if (orgId && role.organizationId !== orgId) {
      throw { status: 403, code: "FORBIDDEN", message: "Cannot delete a global role or role from another organization" };
    }
    await RoleRepository.delete(id);
    await AuditService.logAction({ organizationId: orgId || "PLATFORM", actorId, action: "role.deleted", target: id });
    return true;
  }

  static async getPermissions() {
    return RoleRepository.getPermissions();
  }
}
