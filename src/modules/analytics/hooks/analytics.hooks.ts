import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export function useParticipationAnalytics() {
  return useQuery({
    queryKey: ["analytics", "participation"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/participation");
      return res;
    },
  });
}

export function useRevenueAnalytics() {
  return useQuery({
    queryKey: ["analytics", "revenue"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/revenue");
      return res;
    },
  });
}

export function useFeedbackAnalytics() {
  return useQuery({
    queryKey: ["analytics", "feedback"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/feedback");
      return res;
    },
  });
}

export function useAttendanceAnalytics() {
  return useQuery({
    queryKey: ["analytics", "attendance"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/attendance");
      return res;
    },
  });
}

export function useCertificateAnalytics() {
  return useQuery({
    queryKey: ["analytics", "certificates"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/certificates");
      return res;
    },
  });
}

export function useEvaluationAnalytics() {
  return useQuery({
    queryKey: ["analytics", "evaluations"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/evaluations");
      return res;
    },
  });
}

export function useSponsorAnalytics() {
  return useQuery({
    queryKey: ["analytics", "sponsors"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/sponsors");
      return res;
    },
  });
}

export function useRecruitmentAnalytics() {
  return useQuery({
    queryKey: ["analytics", "recruitment"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/recruitment");
      return res;
    },
  });
}

export function useAIAnalytics() {
  return useQuery({
    queryKey: ["analytics", "ai"],
    queryFn: async () => {
      const res = await fetchApi("/analytics/ai");
      return res;
    },
  });
}
