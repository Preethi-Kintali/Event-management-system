import { CompetitionRepository } from "../repositories/competitions.repository";

export class CompetitionService {
  static async getCompetitions(tenantId: string) {
    return CompetitionRepository.findAll(tenantId);
  }

  static async getCompetition(tenantId: string, id: string) {
    const comp = await CompetitionRepository.findById(tenantId, id);
    if (!comp) {
      throw { status: 404, code: "NOT_FOUND", message: "Competition not found." };
    }
    return comp;
  }

  static async createCompetition(tenantId: string, data: any) {
    return CompetitionRepository.create(tenantId, data);
  }

  static async updateCompetition(tenantId: string, id: string, data: any) {
    const comp = await CompetitionRepository.update(tenantId, id, data);
    if (!comp) {
      throw { status: 404, code: "NOT_FOUND", message: "Competition not found." };
    }
    return comp;
  }

  static async deleteCompetition(tenantId: string, id: string) {
    const comp = await CompetitionRepository.delete(tenantId, id);
    if (!comp) {
      throw { status: 404, code: "NOT_FOUND", message: "Competition not found." };
    }
    return true;
  }
}
