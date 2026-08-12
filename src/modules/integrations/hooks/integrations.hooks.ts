import { useQuery } from "@tanstack/react-query";
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

export const useWebhooks = () => {
  return useQuery({
    queryKey: ["integrations", "webhooks"],
    queryFn: async (): Promise<Webhook[]> => {
      const response = await fetchApi<{data: Webhook[]}>("/api/v1/integrations/webhooks");
      return response.data;
    },
  });
};
