import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiJudge {
  id: string;
  userId: string;
  organizationId: string;
  expertise: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  competitions?: Array<{
    id: string;
    competitionId: string;
    competition: { id: string; name: string };
  }>;
  _evalStats?: {
    assigned: number;
    completed: number;
    avgScore: number;
  };
}

export interface CreateJudgeInput {
  userId: string;
  expertise?: string;
  bio?: string;
}

export interface UpdateJudgeInput {
  expertise?: string;
  bio?: string;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useJudges() {
  return useQuery({
    queryKey: ["judges"],
    queryFn: async () => {
      const res = await fetchApi("/judges");
      return res.data as ApiJudge[];
    },
  });
}

export function useJudge(id: string) {
  return useQuery({
    queryKey: ["judges", id],
    queryFn: async () => {
      const res = await fetchApi(`/judges/${id}`);
      return res.data as ApiJudge;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateJudge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateJudgeInput) => {
      const res = await fetchApi("/judges", { method: "POST", body: JSON.stringify(data) });
      return res.data as ApiJudge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
    },
  });
}

export function useUpdateJudge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateJudgeInput & { id: string }) => {
      const res = await fetchApi(`/judges/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      return res.data as ApiJudge;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
      queryClient.invalidateQueries({ queryKey: ["judges", vars.id] });
    },
  });
}

export function useDeleteJudge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/judges/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
    },
  });
}

export function useAssignJudgeCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ judgeId, competitionId }: { judgeId: string; competitionId: string }) => {
      const res = await fetchApi(`/judges/${judgeId}/competitions`, {
        method: "POST",
        body: JSON.stringify({ competitionId }),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
    },
  });
}
