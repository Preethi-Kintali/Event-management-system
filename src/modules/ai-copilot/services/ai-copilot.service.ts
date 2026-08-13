import { fetchApi } from "@/lib/api-client";
import {
  AIRequest,
  AIConversation,
  AIRecommendation,
  AICopilotDashboardSummary,
} from "../types/ai-copilot.types";

export const AICopilotService = {
  async getDashboardSummary(): Promise<AICopilotDashboardSummary> {
    const res = await fetchApi<{ data: AICopilotDashboardSummary }>("/api/v1/ai-copilot/summary");
    return res.data;
  },

  async getRecentRequests(): Promise<AIRequest[]> {
    const res = await fetchApi<{ data: AIRequest[] }>("/api/v1/ai-copilot/recent");
    return res.data;
  },

  async getConversations(): Promise<AIConversation[]> {
    return [];
  },

  async getRecommendations(): Promise<AIRecommendation[]> {
    return [];
  },

  async generateMockResponse(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `[STUB RESPONSE] This is a mock AI response generated for the prompt: "${prompt}". In a real environment, this would call an actual LLM API.`,
        );
      }, 1500);
    });
  },
};
