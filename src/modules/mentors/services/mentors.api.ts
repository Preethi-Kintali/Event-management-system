import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiMentor {
  id: string;
  userId: string;
  organizationId: string;
  expertise: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  teamAssignments?: Array<{
    id: string;
    teamId: string;
    assignedAt: string;
    team: {
      id: string;
      name: string;
      competition: { id: string; name: string };
    };
  }>;
}

export interface CreateMentorInput {
  userId: string;
  expertise?: string;
  bio?: string;
}

export interface UpdateMentorInput {
  expertise?: string;
  bio?: string;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useMentors() {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const res = await fetchApi("/mentors");
      return res.data as ApiMentor[];
    },
  });
}

export function useMentor(id: string) {
  return useQuery({
    queryKey: ["mentors", id],
    queryFn: async () => {
      const res = await fetchApi(`/mentors/${id}`);
      return res.data as ApiMentor;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMentorInput) => {
      const res = await fetchApi("/mentors", { method: "POST", body: JSON.stringify(data) });
      return res.data as ApiMentor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useUpdateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateMentorInput & { id: string }) => {
      const res = await fetchApi(`/mentors/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return res.data as ApiMentor;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["mentors", vars.id] });
    },
  });
}

export function useDeleteMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/mentors/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useAssignMentorTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mentorId, teamId }: { mentorId: string; teamId: string }) => {
      const res = await fetchApi(`/mentors/${mentorId}/teams`, {
        method: "POST",
        body: JSON.stringify({ teamId }),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
