import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface Communication {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  type: "ANNOUNCEMENT" | "ALERT" | "REMINDER";
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  audience: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator: { firstName: string; lastName: string; email: string };
}

export function useCommunications(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["communications", { page, limit }],
    queryFn: async () => {
      const res = await fetchApi(`/communications?page=${page}&limit=${limit}`);
      return res as { data: Communication[]; total: number; page: number; limit: number };
    },
  });
}

export function useCommunicationsDashboard() {
  return useQuery({
    queryKey: ["communications-dashboard"],
    queryFn: async () => {
      const res = await fetchApi("/communications/dashboard");
      return res.data;
    },
  });
}

export function useMessageLogs() {
  return useQuery({
    queryKey: ["communications-logs"],
    queryFn: async () => {
      // Stub as there is no logs endpoint
      return [];
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["communications-templates"],
    queryFn: async () => {
      // Stub as there is no templates endpoint
      return [];
    },
  });
}

export function useCommunication(id: string) {
  return useQuery({
    queryKey: ["communications", id],
    queryFn: async () => {
      const res = await fetchApi(`/communications/${id}`);
      return res.data as Communication;
    },
    enabled: !!id,
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Communication>) => {
      const res = await fetchApi("/communications", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communications"] });
    },
  });
}

export function useUpdateCommunication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Communication> & { id: string }) => {
      const res = await fetchApi(`/communications/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["communications"] });
      queryClient.invalidateQueries({ queryKey: ["communications", variables.id] });
    },
  });
}

export function usePublishCommunication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/communications/${id}/publish`, {
        method: "POST",
      });
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["communications"] });
      queryClient.invalidateQueries({ queryKey: ["communications", id] });
    },
  });
}

export function useArchiveCommunication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/communications/${id}/archive`, {
        method: "POST",
      });
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["communications"] });
      queryClient.invalidateQueries({ queryKey: ["communications", id] });
    },
  });
}

export function useDeleteCommunication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/communications/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communications"] });
    },
  });
}
