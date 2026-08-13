import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { 
  ApiMetric, 
  Queue, 
  CronJob, 
  ApplicationLog, 
  ServiceHealth, 
  Deployment, 
  SystemDashboardSummary, 
  ApiKey
} from "../types/developer.types";

export function useDeveloperSummary() {
  return useQuery({
    queryKey: ["developer", "summary"],
    queryFn: async () => {
      const res = await fetchApi("/developer/api");
      return res.data as SystemDashboardSummary;
    },
  });
}

export function useDeveloperApiMetrics() {
  return useQuery({
    queryKey: ["developer", "metrics"],
    queryFn: async () => {
      const res = await fetchApi("/developer/api/metrics");
      return res.data as ApiMetric[];
    },
  });
}

export function useDeveloperApiKeys() {
  return useQuery({
    queryKey: ["developer", "api-keys"],
    queryFn: async () => {
      const res = await fetchApi("/developer/api-keys");
      return res.data as ApiKey[];
    },
  });
}

export function useCreateDeveloperApiKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string, environment: string, expiryDays?: number }) => {
      const res = await fetchApi("/developer/api-keys", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developer", "api-keys"] });
    },
  });
}

export function useRevokeDeveloperApiKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/developer/api-keys/${id}/revoke`, {
        method: "POST",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developer", "api-keys"] });
    },
  });
}

export function useDeveloperQueues() {
  return useQuery({
    queryKey: ["developer", "queues"],
    queryFn: async () => {
      const res = await fetchApi("/developer/queues");
      return res.data as Queue[] | null;
    },
  });
}

export function useDeveloperCron() {
  return useQuery({
    queryKey: ["developer", "cron"],
    queryFn: async () => {
      const res = await fetchApi("/developer/cron");
      return res.data as CronJob[] | null;
    },
  });
}

export function useDeveloperLogs() {
  return useQuery({
    queryKey: ["developer", "logs"],
    queryFn: async () => {
      const res = await fetchApi("/developer/logs");
      return res.data as ApplicationLog[];
    },
  });
}

export function useDeveloperHealth() {
  return useQuery({
    queryKey: ["developer", "health"],
    queryFn: async () => {
      const res = await fetchApi("/developer/health");
      return res.data as ServiceHealth[];
    },
    refetchInterval: 30000, // auto refetch health
  });
}

export function useDeveloperDeployments() {
  return useQuery({
    queryKey: ["developer", "deployments"],
    queryFn: async () => {
      const res = await fetchApi("/developer/deployments");
      return res.data as Deployment[];
    },
  });
}
