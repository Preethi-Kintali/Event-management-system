import { AIValidationRecord, ValidationSummary } from "../types/ai-validation.types";
import { fetchApi } from "@/lib/api-client";

export const AIValidationService = {
  async getDashboardSummary(): Promise<ValidationSummary> {
    const res = await fetchApi<{ data: ValidationSummary }>("/api/v1/ai-validation/summary");
    return res.data;
  },

  async getValidationQueue(): Promise<AIValidationRecord[]> {
    const res = await fetchApi<{ data: AIValidationRecord[] }>("/api/v1/ai-validation/queue");
    return res.data;
  },

  async getValidationById(id: string): Promise<AIValidationRecord | undefined> {
    const res = await fetchApi<{ data: AIValidationRecord[] }>("/api/v1/ai-validation/queue");
    return res.data.find((r) => r.submissionId === id);
  },
};
