import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiVolunteer {
  id: string;
  userId: string;
  organizationId: string;
  role: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  eventAssignments?: Array<{
    id: string;
    eventId: string;
    shiftsCount: number;
    hoursCount: number;
    assignedAt: string;
    event: { id: string; name: string };
  }>;
}

export interface CreateVolunteerInput {
  userId: string;
  role?: string;
  bio?: string;
}

export interface UpdateVolunteerInput {
  role?: string;
  bio?: string;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useVolunteers() {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const res = await fetchApi("/volunteers");
      return res.data as ApiVolunteer[];
    },
  });
}

export function useVolunteer(id: string) {
  return useQuery({
    queryKey: ["volunteers", id],
    queryFn: async () => {
      const res = await fetchApi(`/volunteers/${id}`);
      return res.data as ApiVolunteer;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVolunteerInput) => {
      const res = await fetchApi("/volunteers", { method: "POST", body: JSON.stringify(data) });
      return res.data as ApiVolunteer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useUpdateVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateVolunteerInput & { id: string }) => {
      const res = await fetchApi(`/volunteers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return res.data as ApiVolunteer;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers", vars.id] });
    },
  });
}

export function useDeleteVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/volunteers/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useAssignVolunteerEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      volunteerId,
      eventId,
      shiftsCount,
      hoursCount,
    }: {
      volunteerId: string;
      eventId: string;
      shiftsCount?: number;
      hoursCount?: number;
    }) => {
      const res = await fetchApi(`/volunteers/${volunteerId}/events`, {
        method: "POST",
        body: JSON.stringify({ eventId, shiftsCount, hoursCount }),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}
