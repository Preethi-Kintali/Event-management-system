import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import type {
  AIValidationRecord,
  ValidationSummary,
} from "../types/ai-validation.types";

export const useValidationQueue = () => {
  return useQuery({
    queryKey: ["ai-validation", "queue"],
    queryFn: async (): Promise<AIValidationRecord[]> => {
      const response = await fetchApi<{data: AIValidationRecord[]}>("/api/v1/ai-validation/queue");
      return response.data;
    },
  });
};

export const useValidationSummary = () => {
  return useQuery({
    queryKey: ["ai-validation", "summary"],
    queryFn: async (): Promise<ValidationSummary> => {
      const response = await fetchApi<{data: ValidationSummary}>("/api/v1/ai-validation/summary");
      return response.data;
    },
  });
};
