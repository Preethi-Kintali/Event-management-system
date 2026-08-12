import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import type {
  Workflow,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowDashboardSummary,
} from "../types/workflows.types";

export const useWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async (): Promise<Workflow[]> => {
      const response = await fetchApi<{data: Workflow[]}>("/api/v1/workflows");
      return response.data;
    },
  });
};

export const useWorkflowDashboard = () => {
  return useQuery({
    queryKey: ["workflows", "dashboard"],
    queryFn: async (): Promise<WorkflowDashboardSummary> => {
      const response = await fetchApi<{data: WorkflowDashboardSummary}>("/api/v1/workflows/dashboard");
      return response.data;
    },
  });
};

export const useWorkflowExecutions = () => {
  return useQuery({
    queryKey: ["workflows", "executions"],
    queryFn: async (): Promise<WorkflowExecution[]> => {
      const response = await fetchApi<{data: WorkflowExecution[]}>("/api/v1/workflows/executions");
      return response.data;
    },
  });
};

export const useWorkflowTemplates = () => {
  return useQuery({
    queryKey: ["workflows", "templates"],
    queryFn: async (): Promise<WorkflowTemplate[]> => {
      const response = await fetchApi<{data: WorkflowTemplate[]}>("/api/v1/workflows/templates");
      return response.data;
    },
  });
};
