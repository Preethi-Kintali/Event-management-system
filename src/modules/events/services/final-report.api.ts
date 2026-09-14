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
  status: "DRAFT" | "AI_GENERATED" | "FINALIZED";
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

export function useFinalizeReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, finalizedContent }: { eventId: string; finalizedContent: string }) => {
      const res = await fetchApi(`/events/${eventId}/final-report/finalize`, {
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
