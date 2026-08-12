export interface AIRequest {
  id: string;
  feature: string;
  tokens: number;
  durationMs: number;
  status: "Success" | "Failed";
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  lastUpdated: string;
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: "Event Optimization" | "Participant" | "Judge" | "Communication";
  priority: "High" | "Medium" | "Low";
  reason: string;
  expectedImpact: string;
  action: string;
  score: number;
}

export interface GeneratedContent {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AICopilotDashboardSummary {
  totalRequests: number;
  successRate: number;
  tokensUsed: number;
  avgResponseTimeMs: number;
  estimatedCostUSD: number;
  activeFeatures: number;
}
