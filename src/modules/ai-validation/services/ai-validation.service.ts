import { AIValidationRecord, ValidationSummary } from "../types/ai-validation.types";
import { submissions } from "@/lib/mock-data";

export const AIValidationService = {
  async getDashboardSummary(): Promise<ValidationSummary> {
    return {
      totalSubmissions: 8960,
      validatedSubmissions: 8420,
      flaggedSubmissions: 312,
      plagiarismFlags: 145,
      aiContentFlags: 98,
      duplicateFlags: 42,
      codeQualityIssues: 27,
    };
  },

  async getValidationQueue(): Promise<AIValidationRecord[]> {
    return submissions.map((sub, i) => ({
      id: `val_${i}`,
      submissionId: sub.id,
      title: sub.title,
      team: sub.team,
      competition: sub.competition,
      status: ["passed", "flagged", "pending", "manual_review", "processing"][i % 5] as any,
      plagiarismScore: Math.floor(Math.random() * 100),
      aiContentScore: Math.floor(Math.random() * 100),
      duplicateScore: Math.floor(Math.random() * 100),
      codeQuality: Math.floor(Math.random() * 100),
      grammarScore: Math.floor(Math.random() * 100),
      createdDate: sub.submitted === "—" ? "2026-08-01 10:00" : sub.submitted,
    }));
  },

  async getValidationById(id: string): Promise<AIValidationRecord | undefined> {
    const records = await this.getValidationQueue();
    return records.find((r) => r.submissionId === id);
  },
};
