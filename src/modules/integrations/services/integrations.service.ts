import {
  Integration,
  IntegrationConnection,
  ApiKey,
  Webhook,
  IntegrationDashboardSummary,
} from "../types/integrations.types";

export const IntegrationsService = {
  async getDashboardSummary(): Promise<IntegrationDashboardSummary> {
    return {
      totalIntegrations: 45,
      connected: 12,
      disconnected: 31,
      errors: 2,
      apiCalls30d: 1450000,
      webhookEvents30d: 45200,
    };
  },

  async getMarketplace(): Promise<Integration[]> {
    return [
      {
        id: "int_1",
        name: "Google Meet",
        category: "Video",
        description: "Automatically generate meeting links for live sessions.",
        status: "Connected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=GoogleMeet&icon=camera",
      },
      {
        id: "int_2",
        name: "Zoom",
        category: "Video",
        description: "Schedule and manage Zoom webinars for virtual events.",
        status: "Disconnected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=Zoom&icon=camera-movie",
      },
      {
        id: "int_3",
        name: "GitHub",
        category: "Developer Tools",
        description: "Sync repositories and validate participant commits automatically.",
        status: "Connected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=GitHub&icon=brand-github",
      },
      {
        id: "int_4",
        name: "Stripe",
        category: "Payments",
        description: "Process ticket sales, sponsorships, and prize payouts securely.",
        status: "Connected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=Stripe&icon=credit-card",
      },
      {
        id: "int_5",
        name: "WhatsApp Business",
        category: "Communication",
        description: "Send transactional updates and reminders via WhatsApp.",
        status: "Error",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=WhatsApp&icon=brand-whatsapp",
      },
      {
        id: "int_6",
        name: "Google Drive",
        category: "Storage",
        description: "Store generated certificates and uploaded submissions.",
        status: "Connected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=Drive&icon=brand-google-drive",
      },
      {
        id: "int_7",
        name: "Slack",
        category: "Communication",
        description: "Push notifications and alerts directly to your team's Slack channels.",
        status: "Disconnected",
        logo: "https://api.dicebear.com/7.x/icons/svg?seed=Slack&icon=brand-slack",
      },
    ];
  },

  async getConnected(): Promise<IntegrationConnection[]> {
    return [
      {
        id: "conn_1",
        integrationId: "int_3",
        name: "GitHub",
        category: "Developer Tools",
        status: "Connected",
        connectedBy: "Admin User",
        connectedDate: "2025-10-12",
        lastSync: "2 mins ago",
        apiUsage: 45200,
      },
      {
        id: "conn_2",
        integrationId: "int_4",
        name: "Stripe",
        category: "Payments",
        status: "Connected",
        connectedBy: "Finance Lead",
        connectedDate: "2025-11-05",
        lastSync: "1 hour ago",
        apiUsage: 1250,
      },
      {
        id: "conn_3",
        integrationId: "int_1",
        name: "Google Meet",
        category: "Video",
        status: "Connected",
        connectedBy: "Admin User",
        connectedDate: "2026-01-20",
        lastSync: "Yesterday",
        apiUsage: 340,
      },
      {
        id: "conn_4",
        integrationId: "int_5",
        name: "WhatsApp Business",
        category: "Communication",
        status: "Error",
        connectedBy: "Marketing",
        connectedDate: "2026-05-14",
        lastSync: "2 days ago",
        apiUsage: 8900,
      },
    ];
  },

  async getApiKeys(): Promise<ApiKey[]> {
    return [
      {
        id: "key_1",
        name: "Mobile App Production",
        environment: "Production",
        createdBy: "Dev Team",
        createdDate: "2025-06-10",
        lastUsed: "1 min ago",
        status: "Active",
        expiry: "Never",
        maskedKey: "sk_live_••••••••••••8f2a",
      },
      {
        id: "key_2",
        name: "Partner Portal Sync",
        environment: "Production",
        createdBy: "Admin User",
        createdDate: "2025-09-22",
        lastUsed: "4 hours ago",
        status: "Active",
        expiry: "2027-09-22",
        maskedKey: "sk_live_••••••••••••3d9b",
      },
      {
        id: "key_3",
        name: "Local Development",
        environment: "Development",
        createdBy: "Dev Team",
        createdDate: "2026-01-15",
        lastUsed: "Yesterday",
        status: "Active",
        expiry: "Never",
        maskedKey: "sk_test_••••••••••••1a4c",
      },
      {
        id: "key_4",
        name: "Old Analytics Script",
        environment: "Production",
        createdBy: "Marketing",
        createdDate: "2024-11-05",
        lastUsed: "3 months ago",
        status: "Revoked",
        expiry: "2025-11-05",
        maskedKey: "sk_live_••••••••••••9e7d",
      },
    ];
  },

  async getWebhooks(): Promise<Webhook[]> {
    return [
      {
        id: "wh_1",
        name: "Zapier Lead Sync",
        endpoint: "https://hooks.zapier.com/hooks/catch/...",
        events: ["registration.created"],
        status: "Active",
        lastDelivery: "10 mins ago",
        successRate: 100,
      },
      {
        id: "wh_2",
        name: "Internal Discord Alerts",
        endpoint: "https://discord.com/api/webhooks/...",
        events: ["submission.created", "competition.ended"],
        status: "Active",
        lastDelivery: "1 hour ago",
        successRate: 99.8,
      },
      {
        id: "wh_3",
        name: "Legacy CRM Sync",
        endpoint: "https://api.legacy-crm.internal/v1/webhook",
        events: ["user.updated"],
        status: "Failing",
        lastDelivery: "2 days ago",
        successRate: 45.2,
      },
    ];
  },
};
