import { CompetitionRepository } from "../repositories/competitions.repository";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

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

  static async getCompetitionDashboard(tenantId: string, id: string) {
    const competition = await prisma.competition.findFirst({
      where: { id, event: { organizationId: tenantId } },
      include: {
        teams: true,
        submissions: true,
        judgeAssignments: true,
      }
    });

    if (!competition) {
      throw { status: 404, code: "NOT_FOUND", message: "Competition not found." };
    }

    const evaluationLoad = [
      { round: "Round 1", completed: 0, pending: competition.submissions.length },
    ];
    
    // Group submissions into status buckets for kanban
    const statuses = ["DRAFT", "SUBMITTED", "IN_REVIEW", "EVALUATED"];
    const kanbanColumns = statuses.map(status => {
      return {
        id: status.toLowerCase(),
        title: status.replace("_", " "),
        items: competition.submissions.filter(s => s.status === status).map(s => ({
          id: s.id,
          title: "Submission", // Real title if it existed on model
          team: `Team ${s.teamId.substring(0, 5)}`,
          status: s.status
        }))
      }
    });

    return {
      evaluationLoad,
      kanbanColumns,
      metrics: {
        teams: competition.teams.length,
        submissions: competition.submissions.length,
        avgScore: 0, // Mock removed
        judges: competition.judgeAssignments.length,
      }
    };
  }
}
