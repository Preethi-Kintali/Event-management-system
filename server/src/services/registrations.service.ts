import { RegistrationRepository } from "../repositories/registrations.repository";

export class RegistrationService {
  static async getRegistrations(tenantId: string) {
    return RegistrationRepository.findAll(tenantId);
  }

  static async getRegistration(tenantId: string, id: string) {
    const reg = await RegistrationRepository.findById(tenantId, id);
    if (!reg) {
      throw { status: 404, code: "NOT_FOUND", message: "Registration not found." };
    }
    return reg;
  }

  static async createRegistration(tenantId: string, data: any) {
    return RegistrationRepository.create(tenantId, data);
  }

  static async updateRegistration(tenantId: string, id: string, data: any) {
    const reg = await RegistrationRepository.update(tenantId, id, data);
    if (!reg) {
      throw { status: 404, code: "NOT_FOUND", message: "Registration not found." };
    }
    return reg;
  }

  static async deleteRegistration(tenantId: string, id: string) {
    const reg = await RegistrationRepository.delete(tenantId, id);
    if (!reg) {
      throw { status: 404, code: "NOT_FOUND", message: "Registration not found." };
    }
    return true;
  }
}
