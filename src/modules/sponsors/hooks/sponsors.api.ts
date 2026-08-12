import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface SponsorData {
  id: string;
  name: string;
  tier: string;
  value?: number;
  contactEmail?: string;
  status?: string;
  _count?: { events: number; sponsorships: number };
}

export function useSponsorsDashboard() {
  return useQuery({
    queryKey: ["sponsors", "dashboard"],
    queryFn: () => fetchApi<{ success: boolean; data: any }>("/api/v1/sponsors/dashboard").then(r => r.data),
  });
}

export function useSponsors() {
  return useQuery({
    queryKey: ["sponsors"],
    queryFn: () => fetchApi<{ success: boolean; data: SponsorData[] }>("/api/v1/sponsors").then(r => r.data),
  });
}

export function useSponsor(id: string) {
  return useQuery({
    queryKey: ["sponsors", id],
    queryFn: () => fetchApi<{ success: boolean; data: SponsorData }>(`/api/v1/sponsors/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useAddSponsor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SponsorData>) => 
      fetchApi("/api/v1/sponsors", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
}
