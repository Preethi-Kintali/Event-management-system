import { SubmissionRepository } from "../repositories/submissions.repository";

export class SubmissionService {
  static async getSubmissions(tenantId: string) {
    return SubmissionRepository.findAll(tenantId);
  }

  static async getSubmission(tenantId: string, id: string) {
    const sub = await SubmissionRepository.findById(tenantId, id);
    if (!sub) {
      throw { status: 404, code: "NOT_FOUND", message: "Submission not found." };
    }
    return sub;
  }

  static async createSubmission(tenantId: string, data: any) {
    return SubmissionRepository.create(tenantId, data);
  }

  static async updateSubmission(tenantId: string, id: string, data: any) {
    const sub = await SubmissionRepository.update(tenantId, id, data);
    if (!sub) {
      throw { status: 404, code: "NOT_FOUND", message: "Submission not found." };
    }
    return sub;
  }

  static async deleteSubmission(tenantId: string, id: string) {
    const sub = await SubmissionRepository.delete(tenantId, id);
    if (!sub) {
      throw { status: 404, code: "NOT_FOUND", message: "Submission not found." };
    }
    return true;
  }
}
