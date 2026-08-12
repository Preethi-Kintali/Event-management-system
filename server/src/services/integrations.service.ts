import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class IntegrationsService {
  static async getIntegrations(organizationId: string) {
    return prisma.integration.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  }

  static async getIntegrationDashboard(organizationId: string) {
    const total = await prisma.integration.count({ where: { organizationId } });
    const connected = await prisma.integration.count({ where: { organizationId, status: "Connected" } });
    const errors = await prisma.integration.count({ where: { organizationId, status: "Error" } });
    
    // In a real scenario, this would aggregate usage logs.
    const apiCalls30d = 12450;
    const webhookEvents30d = 3840;

    return {
      totalIntegrations: total,
      connected,
      disconnected: total - connected - errors,
      errors,
      apiCalls30d,
      webhookEvents30d,
    };
  }

  static async getApiKeys(organizationId: string) {
    return prisma.apiKey.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getWebhooks(organizationId: string) {
    return prisma.webhook.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
}
