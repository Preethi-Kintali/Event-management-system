import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AICopilotService {
  static async getUsageSummary(organizationId: string) {
    const requests = await prisma.aIRequest.findMany({
      where: { organizationId },
    });

    const totalRequests = requests.length;
    const totalTokens = requests.reduce((sum, req) => sum + req.tokens, 0);
    const successRate = totalRequests > 0 
      ? (requests.filter(r => r.status === "Success").length / totalRequests) * 100 
      : 0;

    return {
      totalRequests,
      totalTokens,
      successRate,
    };
  }

  static async getRecentRequests(organizationId: string) {
    return prisma.aIRequest.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  static async logRequest(organizationId: string, userId: string, feature: string, tokens: number, durationMs: number, status: string) {
    return prisma.aIRequest.create({
      data: {
        organizationId,
        requestedById: userId,
        feature,
        tokens,
        durationMs,
        status,
      },
    });
  }
}
