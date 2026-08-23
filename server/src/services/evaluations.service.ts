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
    data: { score?: number; scores?: Record<string, number>; feedback?: string; status?: string }
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

    let finalScore = data.score;
    let finalFeedback = data.feedback;

    if (data.scores && ev.submission.competition?.rubric) {
      const rubric = ev.submission.competition.rubric as any;
      if (rubric.criteria && Array.isArray(rubric.criteria)) {
        let calculatedScore = 0;
        let isValid = true;
        
        for (const crit of rubric.criteria) {
          const scoreForCrit = data.scores[crit.crit];
          if (scoreForCrit !== undefined) {
             // Assuming score out of weight directly, or score out of max
             // If weight is 25, scoreForCrit should be <= 25 if it's out of weight
             calculatedScore += scoreForCrit;
          } else {
             isValid = false; // Missing criteria
          }
        }
        
        if (isValid) {
          finalScore = calculatedScore;
          // Prepend structured scores to feedback
          const scoresSummary = Object.entries(data.scores).map(([k, v]) => `${k}: ${v}`).join('\\n');
          finalFeedback = `[Rubric Scores]\\n${scoresSummary}\\n\\n${data.feedback || ''}`;
        }
      }
    }

    const updatePayload: any = { status: data.status };
    if (finalScore !== undefined) updatePayload.score = finalScore;
    if (finalFeedback !== undefined) updatePayload.feedback = finalFeedback;

    const updated = await EvaluationRepository.update(tenantId, id, updatePayload);
    if (!updated) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };
    return updated;
  }

  static async deleteEvaluation(tenantId: string, id: string) {
    const deleted = await EvaluationRepository.delete(tenantId, id);
    if (!deleted) throw { status: 404, code: "NOT_FOUND", message: "Evaluation not found." };
    return true;
  }
}
