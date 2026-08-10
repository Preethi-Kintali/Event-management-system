import {
  Workflow,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowDashboardSummary,
} from "../types/workflows.types";

export const WorkflowsService = {
  async getDashboardSummary(): Promise<WorkflowDashboardSummary> {
    return {
      totalWorkflows: 45,
      activeWorkflows: 38,
      pausedWorkflows: 5,
      totalExecutions: 85400,
      successRate: 99.2,
      failedExecutions: 142,
    };
  },

  async getWorkflows(): Promise<Workflow[]> {
    return [
      {
        id: "wf_1",
        name: "Registration Confirmation & Slack Alert",
        trigger: "Registration Created",
        actions: ["Send Email", "Notify Slack"],
        status: "Active",
        lastRun: "2 mins ago",
        executions: 14500,
        successRate: 100,
        createdBy: "System Admin",
      },
      {
        id: "wf_2",
        name: "Judge Assignment Notification",
        trigger: "Evaluation Created",
        actions: ["Assign Judge", "Send Email"],
        status: "Active",
        lastRun: "1 hour ago",
        executions: 3200,
        successRate: 98.5,
        createdBy: "Program Manager",
      },
      {
        id: "wf_3",
        name: "Issue Certificate on Win",
        trigger: "Winner Selected",
        actions: ["Generate Certificate", "Send Email"],
        status: "Active",
        lastRun: "2 days ago",
        executions: 450,
        successRate: 100,
        createdBy: "System Admin",
      },
      {
        id: "wf_4",
        name: "Submission Deadline Warning",
        trigger: "Date Before Deadline",
        actions: ["Send Email", "Send SMS"],
        status: "Paused",
        lastRun: "1 month ago",
        executions: 4200,
        successRate: 99.1,
        createdBy: "Marketing Lead",
      },
      {
        id: "wf_5",
        name: "Legacy Sync",
        trigger: "User Updated",
        actions: ["Webhook Call"],
        status: "Failed",
        lastRun: "3 hours ago",
        executions: 120,
        successRate: 45.0,
        createdBy: "Dev Team",
      },
    ];
  },

  async getWorkflowById(id: string): Promise<Workflow | undefined> {
    const list = await this.getWorkflows();
    return list.find((w) => w.id === id) || list[0];
  },

  async getExecutions(): Promise<WorkflowExecution[]> {
    return [
      {
        id: "exec_1",
        workflowId: "wf_1",
        workflowName: "Registration Confirmation",
        triggerEvent: "registration.created",
        started: "2026-08-10 10:45:12",
        completed: "2026-08-10 10:45:14",
        durationMs: 2400,
        status: "Successful",
      },
      {
        id: "exec_2",
        workflowId: "wf_2",
        workflowName: "Judge Assignment",
        triggerEvent: "evaluation.created",
        started: "2026-08-10 09:12:00",
        completed: "2026-08-10 09:12:01",
        durationMs: 850,
        status: "Successful",
      },
      {
        id: "exec_3",
        workflowId: "wf_5",
        workflowName: "Legacy Sync",
        triggerEvent: "user.updated",
        started: "2026-08-10 08:30:00",
        completed: "2026-08-10 08:30:05",
        durationMs: 5000,
        status: "Failed",
        error: "Connection timeout on Webhook endpoint.",
      },
      {
        id: "exec_4",
        workflowId: "wf_1",
        workflowName: "Registration Confirmation",
        triggerEvent: "registration.created",
        started: "2026-08-10 08:15:22",
        completed: "-",
        durationMs: 0,
        status: "Running",
      },
    ];
  },

  async getTemplates(): Promise<WorkflowTemplate[]> {
    return [
      {
        id: "tpl_1",
        name: "Welcome Series",
        description: "Send a series of onboarding emails when a user registers.",
        trigger: "Registration Created",
        actionCount: 3,
        category: "Communication",
      },
      {
        id: "tpl_2",
        name: "Auto-Assign Judges",
        description: "Randomly assign a judge to a submission based on category.",
        trigger: "Submission Created",
        actionCount: 2,
        category: "Evaluation",
      },
      {
        id: "tpl_3",
        name: "Winner Announcements",
        description: "Generate certificates and notify all participants when winners are selected.",
        trigger: "Winner Selected",
        actionCount: 4,
        category: "Operations",
      },
      {
        id: "tpl_4",
        name: "Inactivity Nudge",
        description: "Send a reminder if a participant hasn't logged in for 7 days.",
        trigger: "Inactivity Detected",
        actionCount: 1,
        category: "Communication",
      },
    ];
  },
};
