import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export type ApiSubmission = {
  id: string;
  title: string;
  payload: Record<string, unknown> | null;
  teamId: string;
  competitionId: string;
  status: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "EVALUATED" | "DISQUALIFIED";
  createdAt: string;
  updatedAt: string;
  competition?: { name: string; event?: { name: string } };
  team?: { name: string; members?: { user: { firstName: string; lastName: string } }[] };
  _count?: { evaluations: number };
  evaluations?: {
    id: string;
    score: number | null;
    feedback: string | null;
    judge: { firstName: string; lastName: string };
  }[];
};

export type CreateSubmissionInput = {
  title: string;
  payload?: Record<string, unknown>;
  teamId: string;
  competitionId: string;
  status?: string;
};


export function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const res = await fetchApi("/submissions");
      return res.data as ApiSubmission[];
    },
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: async () => {
      const res = await fetchApi(`/submissions/${id}`);
      return res.data as ApiSubmission;
    },
    enabled: !!id,
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSubmissionInput) => {
      const res = await fetchApi("/submissions", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateSubmissionInput> & { id: string }) => {
      const res = await fetchApi(`/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiSubmission;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submissions", variables.id] });
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/submissions/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
