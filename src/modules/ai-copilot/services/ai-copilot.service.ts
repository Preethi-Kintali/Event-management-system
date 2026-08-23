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

  async chat(message: string, context?: any): Promise<string> {
    const res = await fetchApi<{ data: { response: string } }>("/ai-copilot/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    });
    return res.data.response;
  },
};
