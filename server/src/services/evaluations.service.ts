import { EvaluationRepository } from "../repositories/evaluations.repository";

export class EvaluationService {
  static async getEvaluations(tenantId: string) {
    return EvaluationRepository.findAll(tenantId);
  }

  static async getMyEvaluations(tenantId: string, judgeUserId: string) {
    return EvaluationRepository.findByJudge(tenantId, judgeUserId);
  }

  static async getEvaluation(tenantId: string, id: string) {
    const ev = await EvaluationRepository.findById(tenantId, id);
    if (!ev) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };
    return ev;
  }

  static async createEvaluation(tenantId: string, data: { submissionId: string; judgeId: string }) {
    try {
      return await EvaluationRepository.create(tenantId, data);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw { status: 409, code: "CONFLICT", message: "This judge is already assigned to this submission." };
      }
      throw err;
    }
  }

  static async updateEvaluation(
    tenantId: string,
    id: string,
    actorUserId: string,
    isAdmin: boolean,
    data: { score?: number; feedback?: string; status?: string }
  ) {
    const ev = await EvaluationRepository.findById(tenantId, id);
    if (!ev) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };

    // Security: only the assigned judge or an admin may update
    if (!isAdmin && ev.judgeId !== actorUserId) {
      throw {
        status: 403,
        code: "FORBIDDEN",
        message: "You are not authorized to update this evaluation.",
      };
    }

    const updated = await EvaluationRepository.update(tenantId, id, data as any);
    if (!updated) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };
    return updated;
  }

  static async deleteEvaluation(tenantId: string, id: string) {
    const deleted = await EvaluationRepository.delete(tenantId, id);
    if (!deleted) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };
    return true;
  }
}
