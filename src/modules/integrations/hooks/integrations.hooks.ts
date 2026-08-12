import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import type {
  Integration,
  ApiKey,
  Webhook,
  IntegrationDashboardSummary,
} from "../types/integrations.types";

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: async (): Promise<Integration[]> => {
      const response = await fetchApi<{data: Integration[]}>("/api/v1/integrations");
      return response.data;
    },
  });
};

export const useIntegrationDashboard = () => {
  return useQuery({
    queryKey: ["integrations", "dashboard"],
    queryFn: async (): Promise<IntegrationDashboardSummary> => {
      const response = await fetchApi<{data: IntegrationDashboardSummary}>("/api/v1/integrations/dashboard");
      return response.data;
    },
  });
};

export const useApiKeys = () => {
  return useQuery({
    queryKey: ["integrations", "api-keys"],
    queryFn: async (): Promise<ApiKey[]> => {
      const response = await fetchApi<{data: ApiKey[]}>("/api/v1/integrations/api-keys");
      return response.data;
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; environment: string; expiresInDays?: number }) => {
      return fetchApi<{ data: ApiKey & { rawKey: string } }>("/api/v1/integrations/api-keys", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "api-keys"] });
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/api/v1/integrations/api-keys/${id}/revoke`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "api-keys"] });
    },
  });
};

export const useWebhooks = () => {
  return useQuery({
    queryKey: ["integrations", "webhooks"],
    queryFn: async (): Promise<Webhook[]> => {
      const response = await fetchApi<{data: Webhook[]}>("/api/v1/integrations/webhooks");
      return response.data;
    },
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; endpoint: string; events: string[] }) => {
      return fetchApi<{ data: Webhook }>("/api/v1/integrations/webhooks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks"] });
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Webhook> }) => {
      return fetchApi<{ data: Webhook }>(`/api/v1/integrations/webhooks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks"] });
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/api/v1/integrations/webhooks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks"] });
    },
  });
};

export const useWebhookDeliveries = (webhookId: string | null) => {
  return useQuery({
    queryKey: ["integrations", "webhooks", webhookId, "deliveries"],
    queryFn: async (): Promise<any[]> => {
      if (!webhookId) return [];
      const response = await fetchApi<{data: any[]}>(`/api/v1/integrations/webhooks/${webhookId}/deliveries`);
      return response.data;
    },
    enabled: !!webhookId,
  });
};

export const usePingWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApi<{ data: any }>(`/api/v1/integrations/webhooks/${id}/ping`, {
        method: "POST",
      });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks"] });
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks", id, "deliveries"] });
    },
  });
};
