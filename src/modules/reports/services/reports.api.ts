import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export function useReportsDashboard() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: async () => {
      const data = await fetchApi("/reports/dashboard");
      return data;
    },
  });
}

export function useEventReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "events", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/events?${qs}`);
      return data;
    },
  });
}

export function useCompetitionReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "competitions", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/competitions?${qs}`);
      return data;
    },
  });
}

export function useParticipantReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "participants", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/participants?${qs}`);
      return data;
    },
  });
}

export function useEvaluationReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "evaluations", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/evaluations?${qs}`);
      return data;
    },
  });
}

export function useAttendanceReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "attendance", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/attendance?${qs}`);
      return data;
    },
  });
}

export function useCertificateReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "certificates", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/certificates?${qs}`);
      return data;
    },
  });
}

export function useWinnerReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "winners", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/winners?${qs}`);
      return data;
    },
  });
}

export function useCommunicationReports(filters: any) {
  return useQuery({
    queryKey: ["reports", "communications", filters],
    queryFn: async () => {
      const qs = new URLSearchParams(filters).toString();
      const data = await fetchApi(`/reports/communications?${qs}`);
      return data;
    },
  });
}

