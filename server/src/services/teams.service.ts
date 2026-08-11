import { TeamRepository } from "../repositories/teams.repository";

export class TeamService {
  static async getTeams(tenantId: string) {
    return TeamRepository.findAll(tenantId);
  }

  static async getTeam(tenantId: string, id: string) {
    const team = await TeamRepository.findById(tenantId, id);
    if (!team) {
      throw { status: 404, code: "NOT_FOUND", message: "Team not found." };
    }
    return team;
  }

  static async createTeam(tenantId: string, data: any) {
    return TeamRepository.create(tenantId, data);
  }

  static async updateTeam(tenantId: string, id: string, data: any) {
    const team = await TeamRepository.update(tenantId, id, data);
    if (!team) {
      throw { status: 404, code: "NOT_FOUND", message: "Team not found." };
    }
    return team;
  }

  static async deleteTeam(tenantId: string, id: string) {
    const team = await TeamRepository.delete(tenantId, id);
    if (!team) {
      throw { status: 404, code: "NOT_FOUND", message: "Team not found." };
    }
    return true;
  }
}
