import { MentorRepository } from "../repositories/mentors.repository";

export class MentorService {
  static async getMentors(tenantId: string) {
    return MentorRepository.findAll(tenantId);
  }

  static async getMentor(tenantId: string, id: string) {
    const mentor = await MentorRepository.findById(tenantId, id);
    if (!mentor) throw { status: 404, code: "NOT_FOUND", message: "Mentor not found." };
    return mentor;
  }

  static async createMentor(tenantId: string, data: { userId: string; expertise?: string; bio?: string }) {
    try {
      return await MentorRepository.create(tenantId, data);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw { status: 409, code: "CONFLICT", message: "This user already has a mentor profile in this organization." };
      }
      throw err;
    }
  }

  static async updateMentor(tenantId: string, id: string, data: { expertise?: string; bio?: string }) {
    const mentor = await MentorRepository.update(tenantId, id, data);
    if (!mentor) throw { status: 404, code: "NOT_FOUND", message: "Mentor not found." };
    return mentor;
  }

  static async deleteMentor(tenantId: string, id: string) {
    const mentor = await MentorRepository.delete(tenantId, id);
    if (!mentor) throw { status: 404, code: "NOT_FOUND", message: "Mentor not found." };
    return true;
  }

  static async assignTeam(tenantId: string, mentorId: string, teamId: string) {
    try {
      return await MentorRepository.assignTeam(tenantId, mentorId, teamId);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw { status: 409, code: "CONFLICT", message: "Mentor is already assigned to this team." };
      }
      throw err;
    }
  }

  static async removeTeam(tenantId: string, mentorId: string, teamId: string) {
    return MentorRepository.removeTeam(tenantId, mentorId, teamId);
  }
}
