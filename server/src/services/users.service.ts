import { UserRepository } from "../repositories/users.repository";
import { AuditService } from "./audit.service";
import { UserStatus } from "@prisma/client";

export class UserService {
  static async getMe(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return user;
  }

  static async updateMe(id: string, data: any) {
    const updated = await UserRepository.update(id, data);
    return updated;
  }

  static async getAll() {
    return UserRepository.findAll();
  }

  static async getById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return user;
  }

  static async update(id: string, data: any, actorId: string) {
    const user = await this.getById(id);
    const updated = await UserRepository.update(id, data);
    await AuditService.logAction({ organizationId: "PLATFORM", actorId, action: "user.updated", target: id, metadata: data });
    return updated;
  }

  static async updateStatus(id: string, status: UserStatus, actorId: string) {
    await this.getById(id);
    const updated = await UserRepository.update(id, { status });
    await AuditService.logAction({ organizationId: "PLATFORM", actorId, action: "user.status_updated", target: id, metadata: { status } });
    return updated;
  }
}
