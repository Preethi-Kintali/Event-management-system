import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export type ApiEvent = {
  id: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: string;
};

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetchApi("/events");
      return res.data as ApiEvent[];
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const res = await fetchApi(`/events/${id}`);
      return res.data as ApiEvent;
    },
    enabled: !!id,
  });
}

export function useEventDashboard(id: string) {
  return useQuery({
    queryKey: ["events", id, "dashboard"],
    queryFn: async () => {
      const res = await fetchApi(`/events/${id}/dashboard`);
      return res.data as {
        registrationTrend: any[];
        metrics: {
          registrations: number;
          teams: number;
          submissions: number;
          revenue: number;
        };
      };
    },
    enabled: !!id,
  });
}

export function useEventSessions(id: string) {
  return useQuery({
    queryKey: ["events", id, "sessions"],
    queryFn: async () => {
      const res = await fetchApi(`/events/${id}/sessions`);
      return res.data as {
        id: string;
        name: string;
        description: string;
        startTime: string;
        endTime: string;
        status: string;
      }[];
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const res = await fetchApi("/events", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateEventInput> & { id: string }) => {
      const res = await fetchApi(`/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiEvent;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/events/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
