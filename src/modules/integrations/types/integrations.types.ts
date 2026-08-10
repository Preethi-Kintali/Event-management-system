export type IntegrationCategory =
  | "Communication"
  | "Payments"
  | "Video"
  | "Storage"
  | "Developer Tools"
  | "Productivity"
  | "Social"
  | "Analytics";
export type ConnectionStatus = "Connected" | "Disconnected" | "Error";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  status: ConnectionStatus;
  logo: string;
}

export interface IntegrationConnection {
  id: string;
  integrationId: string;
  name: string;
  category: IntegrationCategory;
  status: ConnectionStatus;
  connectedBy: string;
  connectedDate: string;
  lastSync: string;
  apiUsage: number;
}

export interface ApiKey {
  id: string;
  name: string;
  environment: "Production" | "Staging" | "Development";
  createdBy: string;
  createdDate: string;
  lastUsed: string;
  status: "Active" | "Revoked" | "Expired";
  expiry: string;
  maskedKey: string;
}

export interface Webhook {
  id: string;
  name: string;
  endpoint: string;
  events: string[];
  status: "Active" | "Disabled" | "Failing";
  lastDelivery: string;
  successRate: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  timestamp: string;
  status: "Success" | "Failed";
  responseCode: number;
  durationMs: number;
}

export interface IntegrationDashboardSummary {
  totalIntegrations: number;
  connected: number;
  disconnected: number;
  errors: number;
  apiCalls30d: number;
  webhookEvents30d: number;
}
