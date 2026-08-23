import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AIContextService {
  /**
   * Retrieves events and basic organization info to provide context for the LLM.
   */
  static async getPlatformContext(organizationId: string): Promise<string> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        events: {
          select: { name: true, description: true, startTime: true, endTime: true, status: true },
          take: 5,
          orderBy: { startTime: "asc" }
        }
      }
    });

    if (!org) {
      return "Organization context not found.";
    }

    let context = `Organization: ${org.name}\n`;
    
    if (org.events.length > 0) {
      context += `Events Context:\n`;
      org.events.forEach(e => {
        context += `- ${e.name} (Status: ${e.status}), starting ${e.startTime.toISOString()}.\n`;
      });
    }

    return context;
  }
}
