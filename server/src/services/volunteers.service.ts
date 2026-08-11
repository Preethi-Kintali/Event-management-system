import { VolunteerRepository } from "../repositories/volunteers.repository";

export class VolunteerService {
  static async getVolunteers(tenantId: string) {
    return VolunteerRepository.findAll(tenantId);
  }

  static async getVolunteer(tenantId: string, id: string) {
    const volunteer = await VolunteerRepository.findById(tenantId, id);
    if (!volunteer) throw { status: 404, code: "NOT_FOUND", message: "Volunteer not found." };
    return volunteer;
  }

  static async createVolunteer(tenantId: string, data: { userId: string; role?: string; bio?: string }) {
    try {
      return await VolunteerRepository.create(tenantId, data);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw { status: 409, code: "CONFLICT", message: "This user already has a volunteer profile in this organization." };
      }
      throw err;
    }
  }

  static async updateVolunteer(tenantId: string, id: string, data: { role?: string; bio?: string }) {
    const volunteer = await VolunteerRepository.update(tenantId, id, data);
    if (!volunteer) throw { status: 404, code: "NOT_FOUND", message: "Volunteer not found." };
    return volunteer;
  }

  static async deleteVolunteer(tenantId: string, id: string) {
    const volunteer = await VolunteerRepository.delete(tenantId, id);
    if (!volunteer) throw { status: 404, code: "NOT_FOUND", message: "Volunteer not found." };
    return true;
  }

  static async assignEvent(
    tenantId: string,
    volunteerId: string,
    eventId: string,
    shiftsCount?: number,
    hoursCount?: number
  ) {
    try {
      return await VolunteerRepository.assignEvent(tenantId, volunteerId, eventId, shiftsCount, hoursCount);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw { status: 409, code: "CONFLICT", message: "Volunteer is already assigned to this event." };
      }
      throw err;
    }
  }

  static async removeEvent(tenantId: string, volunteerId: string, eventId: string) {
    return VolunteerRepository.removeEvent(tenantId, volunteerId, eventId);
  }
}
