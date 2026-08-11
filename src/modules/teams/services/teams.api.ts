import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export type ApiTeam = {
  id: string;
  name: string;
  competitionId: string;
  createdAt: string;
  updatedAt: string;
  competition?: { name: string; event?: { name: string } };
  _count?: { members: number; submissions: number };
  members?: Array<{
    id: string;
    isLead: boolean;
    user: { firstName: string | null; lastName: string | null; email: string };
  }>;
};

export type CreateTeamInput = {
  name: string;
  competitionId: string;
};

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetchApi("/teams");
      return res.data as ApiTeam[];
    },
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: async () => {
      const res = await fetchApi(`/teams/${id}`);
      return res.data as ApiTeam;
    },
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTeamInput) => {
      const res = await fetchApi("/teams", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiTeam;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CreateTeamInput> & { id: string }) => {
      const res = await fetchApi(`/teams/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiTeam;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.id] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/teams/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}
