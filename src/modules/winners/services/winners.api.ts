import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export const useWinnersDashboard = () => {
  return useQuery({
    queryKey: ["winners-dashboard"],
    queryFn: () => fetchApi<{ data: any }>("/winners/dashboard").then((res) => res.data),
  });
};

export const useWinners = (competitionId?: string) => {
  return useQuery({
    queryKey: ["winners", competitionId],
    queryFn: () => {
      const qs = competitionId ? `?competitionId=${competitionId}` : "";
      return fetchApi<{ data: any }>(`/winners${qs}`).then((res) => res.data);
    },
  });
};

export const useWinner = (id: string) => {
  return useQuery({
    queryKey: ["winners", id],
    queryFn: () => fetchApi<{ data: any }>(`/winners/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

export const useSelectWinner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchApi<{ data: any }>("/winners", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["winners"] });
      queryClient.invalidateQueries({ queryKey: ["winners-dashboard"] });
    },
  });
};

export const useFinalizeWinner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ data: any }>(`/winners/${id}/finalize`, {
        method: "POST",
      }).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["winners"] });
      queryClient.invalidateQueries({ queryKey: ["winners", id] });
      queryClient.invalidateQueries({ queryKey: ["winners-dashboard"] });
    },
  });
};

export const usePrizes = (competitionId?: string) => {
  return useQuery({
    queryKey: ["prizes", competitionId],
    queryFn: () => {
      const qs = competitionId ? `?competitionId=${competitionId}` : "";
      return fetchApi<{ data: any }>(`/winners/prizes${qs}`).then((res) => res.data);
    },
  });
};
