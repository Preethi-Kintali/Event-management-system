import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import type { AIRequest } from "../types/ai-copilot.types";

export const useCopilotUsage = () => {
  return useQuery({
    queryKey: ["ai-copilot", "usage"],
    queryFn: async (): Promise<{ totalRequests: number; totalTokens: number; successRate: number }> => {
      const response = await fetchApi<{data: { totalRequests: number; totalTokens: number; successRate: number }}>("/api/v1/ai-copilot/summary");
      return response.data;
    },
  });
};

export const useRecentRequests = () => {
  return useQuery({
    queryKey: ["ai-copilot", "recent"],
    queryFn: async (): Promise<AIRequest[]> => {
      const response = await fetchApi<{data: AIRequest[]}>("/api/v1/ai-copilot/recent");
      return response.data;
    },
  });
};
