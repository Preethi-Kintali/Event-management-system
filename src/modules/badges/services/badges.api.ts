import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export const useBadgesDashboard = () => {
  return useQuery({
    queryKey: ["badges-dashboard"],
    queryFn: () => fetchApi<{ data: any }>("/badges/dashboard").then((res) => res.data),
  });
};

export const useBadges = () => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: () => fetchApi<{ data: any }>("/badges").then((res) => res.data),
  });
};

export const useBadge = (id: string) => {
  return useQuery({
    queryKey: ["badges", id],
    queryFn: () => fetchApi<{ data: any }>(`/badges/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchApi("/badges", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      queryClient.invalidateQueries({ queryKey: ["badges-dashboard"] });
    },
  });
};

export const useAwardBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ badgeId, recipientUserId }: { badgeId: string; recipientUserId: string }) =>
      fetchApi(`/badges/${badgeId}/award`, {
        method: "POST",
        body: JSON.stringify({ recipientUserId }),
      }).then((res) => res.data),
    onSuccess: (_, { badgeId }) => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      queryClient.invalidateQueries({ queryKey: ["badges", badgeId] });
      queryClient.invalidateQueries({ queryKey: ["badges-dashboard"] });
    },
  });
};

export const useAchievements = () => {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => fetchApi<{ data: any }>("/badges/achievements").then((res) => res.data),
  });
};
