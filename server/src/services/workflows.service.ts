import { prisma } from "../utils/prisma";

export class WorkflowsService {
  static async getWorkflows(organizationId: string) {
    return prisma.workflow.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getWorkflowDashboard(organizationId: string) {
    const [total, active, paused, executions, failed] = await Promise.all([
      prisma.workflow.count({ where: { organizationId } }),
      prisma.workflow.count({ where: { organizationId, status: "Active" } }),
      prisma.workflow.count({ where: { organizationId, status: "Paused" } }),
      prisma.workflowExecution.count({
        where: { workflow: { organizationId } },
      }),
      prisma.workflowExecution.count({
        where: { workflow: { organizationId }, status: "Failed" },
      }),
    ]);

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
