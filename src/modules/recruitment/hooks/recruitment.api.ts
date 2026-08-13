import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface RecruitmentCandidate {
  id: string;
  participantId?: string;
  participant?: any;
  role?: string;
  company?: string;
  stage?: string;
  score?: number;
  source?: string;
  status?: string;
}

export function useRecruitmentDashboard() {
  return useQuery({
    queryKey: ["recruitment", "dashboard"],
    queryFn: () => fetchApi<{ success: boolean; data: any }>("/api/v1/recruitment/dashboard").then(r => r.data),
  });
}

export function useRecruitmentJobs() {
  return useQuery({
    queryKey: ["recruitment", "jobs"],
    queryFn: () => fetchApi<{ success: boolean; data: any[] }>("/api/v1/recruitment/jobs").then(r => r.data),
  });
}

export function useRecruitmentCandidates() {
  return useQuery({
    queryKey: ["recruitment", "candidates"],
    queryFn: () => fetchApi<{ success: boolean; data: RecruitmentCandidate[] }>("/api/v1/recruitment/candidates").then(r => r.data),
  });
}

export function useRecruitmentCandidate(id: string) {
  return useQuery({
    queryKey: ["recruitment", "candidates", id],
    queryFn: () => fetchApi<{ success: boolean; data: RecruitmentCandidate }>(`/api/v1/recruitment/candidates/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useAddRecruitmentCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => 
      fetchApi("/api/v1/recruitment/candidates", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment", "candidates"] });
    },
  });
}
