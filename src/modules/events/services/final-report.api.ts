import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface EventFinalReport {
  id: string;
  eventId: string;
  organizationId: string;
  coordinatorId: string;
  executiveSummary: string | null;
  eventOutcome: string | null;
  keyHighlights: string | null;
  challenges: string | null;
  recommendations: string | null;
  additionalRemarks: string | null;
  supportingDocuments: any | null;
  aiGeneratedContent: string | null;
  finalizedContent: string | null;
  facultyId: string | null;
  facultyComment: string | null;
  facultyReviewedAt: string | null;
  managerId: string | null;
  managerComment: string | null;
  managerReviewedAt: string | null;
  status: "DRAFT" | "AI_GENERATED" | "SUBMITTED_TO_FACULTY" | "CHANGES_REQUESTED_BY_FACULTY" | "SUBMITTED_TO_MANAGER" | "CHANGES_REQUESTED_BY_MANAGER" | "APPROVED" | "FINALIZED";
  createdAt: string;
  updatedAt: string;
}

export function useFinalReport(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "final-report"],
    queryFn: async () => {
      try {
        const res = await fetchApi(`/events/${eventId}/final-report`);
        return res.data.report as EventFinalReport | null;
      } catch (error: any) {
        if (error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
    enabled: !!eventId,
  });
}

export function useSaveDraftReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: any }) => {
      const res = await fetchApi(`/events/${eventId}/final-report/draft`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data.report as EventFinalReport;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events", variables.eventId, "final-report"] });
    },
  });
}

export function useGenerateAIDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetchApi(`/events/${eventId}/final-report/generate`, {
        method: "POST",
      });
      return res.data.report as EventFinalReport;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "final-report"] });
    },
  });
}

export function useSubmitToFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, finalizedContent }: { eventId: string; finalizedContent: string }) => {
      const res = await fetchApi(`/events/${eventId}/final-report/submit-faculty`, {
        method: "POST",
        body: JSON.stringify({ finalizedContent }),
      });
      return res.data.report as EventFinalReport;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events", variables.eventId, "final-report"] });
    },
  });
}

export function useFacultyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, action, comment }: { eventId: string; action: 'APPROVE' | 'REQUEST_CHANGES'; comment: string }) => {
      const res = await fetchApi(`/events/${eventId}/final-report/faculty-review`, {
        method: "POST",
        body: JSON.stringify({ action, comment }),
      });
      return res.data.report as EventFinalReport;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events", variables.eventId, "final-report"] });
    },
  });
}

export function useManagerReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, action, comment }: { eventId: string; action: 'APPROVE' | 'REQUEST_CHANGES'; comment: string }) => {
      const res = await fetchApi(`/events/${eventId}/final-report/manager-review`, {
        method: "POST",
        body: JSON.stringify({ action, comment }),
      });
      return res.data.report as EventFinalReport;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events", variables.eventId, "final-report"] });
    },
  });
}
