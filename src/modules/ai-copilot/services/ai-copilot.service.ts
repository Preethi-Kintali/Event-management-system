import {
  AIRequest,
  AIConversation,
  AIRecommendation,
  AICopilotDashboardSummary,
} from "../types/ai-copilot.types";

export const AICopilotService = {
  async getDashboardSummary(): Promise<AICopilotDashboardSummary> {
    return {
      totalRequests: 14520,
      successRate: 98.5,
      tokensUsed: 12450000,
      avgResponseTimeMs: 1450,
      estimatedCostUSD: 42.5,
      activeFeatures: 8,
    };
  },

  async getRecentRequests(): Promise<AIRequest[]> {
    return [
      {
        id: "req_1",
        feature: "Event Description",
        tokens: 450,
        durationMs: 1200,
        status: "Success",
        createdAt: "2 mins ago",
      },
      {
        id: "req_2",
        feature: "Rubric Generation",
        tokens: 850,
        durationMs: 2100,
        status: "Success",
        createdAt: "15 mins ago",
      },
      {
        id: "req_3",
        feature: "Email Generation",
        tokens: 320,
        durationMs: 800,
        status: "Success",
        createdAt: "1 hour ago",
      },
      {
        id: "req_4",
        feature: "Chat Assistant",
        tokens: 120,
        durationMs: 400,
        status: "Failed",
        createdAt: "2 hours ago",
      },
    ];
  },

  async getConversations(): Promise<AIConversation[]> {
    return [
      {
        id: "conv_1",
        title: "Drafting API integration spec",
        lastUpdated: "10 mins ago",
        messages: [
          {
            id: "m1",
            role: "user",
            content: "Help me write a spec for integrating with Stripe.",
            timestamp: "2026-08-10T10:00:00Z",
          },
          {
            id: "m2",
            role: "assistant",
            content:
              "Certainly! Here is a draft specification for a Stripe integration focusing on checkout and webhooks...",
            timestamp: "2026-08-10T10:00:05Z",
          },
        ],
      },
      {
        id: "conv_2",
        title: "Evaluation criteria for design",
        lastUpdated: "Yesterday",
        messages: [
          {
            id: "m3",
            role: "user",
            content: "What are good criteria for a UI design competition?",
            timestamp: "2026-08-09T14:00:00Z",
          },
          {
            id: "m4",
            role: "assistant",
            content:
              "For a UI design competition, you should consider: 1. Visual Aesthetics 2. Usability & UX 3. Accessibility 4. Originality.",
            timestamp: "2026-08-09T14:00:04Z",
          },
        ],
      },
    ];
  },

  async getRecommendations(): Promise<AIRecommendation[]> {
    return [
      {
        id: "rec_1",
        title: "Optimize Hackathon Schedule",
        category: "Event Optimization",
        priority: "High",
        reason:
          "Based on historical data, engagement drops significantly between 2 PM and 4 PM on day 2.",
        expectedImpact: "Increase active participation by 15%",
        action: "Schedule a high-energy mini-event or workshop at 2:30 PM.",
        score: 94,
      },
      {
        id: "rec_2",
        title: "Send Reminder Emails",
        category: "Communication",
        priority: "Medium",
        reason:
          "40% of registered participants have not logged in within 48 hours of the event start.",
        expectedImpact: "Improve attendance rate",
        action: "Draft and send a reminder campaign targeting inactive registrants.",
        score: 82,
      },
      {
        id: "rec_3",
        title: "Reassign Judge Load",
        category: "Judge",
        priority: "High",
        reason: "Judge Sarah Jenkins has 45 submissions assigned, while the average is 15.",
        expectedImpact: "Prevent bottleneck in evaluations",
        action: "Redistribute 30 submissions to other judges in the same category.",
        score: 89,
      },
    ];
  },

  async generateMockResponse(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `This is a mock AI response generated for the prompt: "${prompt}". In a real environment, this would call an LLM API.`,
        );
      }, 1500);
    });
  },
};
