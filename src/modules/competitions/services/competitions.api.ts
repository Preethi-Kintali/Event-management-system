import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export type ApiCompetition = {
  id: string;
  name: string;
  description: string | null;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  event?: { name: string };
  _count?: { teams: number; submissions: number };
};

export type CreateCompetitionInput = {
  name: string;
  description?: string;
  eventId: string;
};

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const res = await fetchApi("/competitions");
      return res.data as ApiCompetition[];
    },
  });
}

export function useCompetition(id: string) {
  return useQuery({
    queryKey: ["competitions", id],
    queryFn: async () => {
      const res = await fetchApi(`/competitions/${id}`);
      return res.data as ApiCompetition;
    },
    enabled: !!id,
  });
}

export function useCreateCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompetitionInput) => {
      const res = await fetchApi("/competitions", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiCompetition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
  });
}

export function useUpdateCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateCompetitionInput> & { id: string }) => {
      const res = await fetchApi(`/competitions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiCompetition;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["competitions", variables.id] });
    },
  });
}

export function useDeleteCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/competitions/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
  });
}
