export type WorkflowStatus = "Active" | "Paused" | "Draft" | "Failed";
export type ExecutionStatus = "Running" | "Successful" | "Failed" | "Cancelled";

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  status: WorkflowStatus;
  lastRun: string;
  executions: number;
  successRate: number;
  createdBy: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  triggerEvent: string;
  started: string;
  completed: string;
  durationMs: number;
  status: ExecutionStatus;
  error?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actionCount: number;
  category: "Communication" | "Operations" | "Evaluation" | "Certificates";
}

export interface WorkflowDashboardSummary {
  totalWorkflows: number;
  activeWorkflows: number;
  pausedWorkflows: number;
  totalExecutions: number;
  successRate: number;
  failedExecutions: number;
}
