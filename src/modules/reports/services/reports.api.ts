import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export function useReportsDashboard() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: async () => {
      const response = await fetchApi<{success: boolean, data: any}>("/reports/dashboard");
      return response.data;
    },
  });
}

export function useEventReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "events", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/events?${qs}`);
      return response.data;
    },
  });
}

export function useCompetitionReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "competitions", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/competitions?${qs}`);
      return response.data;
    },
  });
}

export function useParticipantReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "participants", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/participants?${qs}`);
      return response.data;
    },
  });
}

export function useEvaluationReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "evaluations", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/evaluations?${qs}`);
      return response.data;
    },
  });
}

export function useAttendanceReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "attendance", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/attendance?${qs}`);
      return response.data;
    },
  });
}

export function useCertificateReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "certificates", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/certificates?${qs}`);
      return response.data;
    },
  });
}

export function useWinnerReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "winners", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/winners?${qs}`);
      return response.data;
    },
  });
}

export function useCommunicationReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "communications", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const response = await fetchApi<{success: boolean, data: any[]}>(`/reports/communications?${qs}`);
      return response.data;
    },
  });
}

