import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WorkflowsService {
  static async getWorkflows(organizationId: string) {
    return prisma.workflow.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getWorkflowDashboard(organizationId: string) {
    const total = await prisma.workflow.count({ where: { organizationId } });
    const active = await prisma.workflow.count({ where: { organizationId, status: "Active" } });
    const paused = await prisma.workflow.count({ where: { organizationId, status: "Paused" } });
    const executions = await prisma.workflowExecution.count({
      where: { workflow: { organizationId } },
    });
    const failed = await prisma.workflowExecution.count({
      where: { workflow: { organizationId }, status: "Failed" },
    });

    return {
      totalWorkflows: total,
      activeWorkflows: active,
      pausedWorkflows: paused,
      totalExecutions: executions,
      successRate: executions > 0 ? ((executions - failed) / executions) * 100 : 0,
      failedExecutions: failed,
    };
  }

  static async getWorkflowExecutions(organizationId: string) {
    return prisma.workflowExecution.findMany({
      where: { workflow: { organizationId } },
      include: { workflow: { select: { name: true } } },
      orderBy: { started: "desc" },
    });
  }

  static async getWorkflowTemplates() {
    return prisma.workflowTemplate.findMany({
      orderBy: { name: "asc" },
    });
  }
}
