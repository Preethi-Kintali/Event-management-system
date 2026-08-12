import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { Survey, SurveyQuestion, SurveyResponse } from "@prisma/client";

// Dashboard
export function useFeedbackDashboard() {
  return useQuery({
    queryKey: ["feedback", "dashboard"],
    queryFn: () => fetchApi<{ success: boolean; data: any }>("/api/v1/feedback/dashboard").then(r => r.data),
  });
}

// Surveys
export function useSurveys() {
  return useQuery({
    queryKey: ["feedback", "surveys"],
    queryFn: () => fetchApi<{ success: boolean; data: Survey[] }>("/api/v1/feedback/surveys").then(r => r.data),
  });
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ["feedback", "surveys", id],
    queryFn: () => fetchApi<{ success: boolean; data: Survey }>(`/api/v1/feedback/surveys/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

// Survey Responses
export function useFeedbackList() {
  return useQuery({
    queryKey: ["feedback", "responses"],
    queryFn: () => fetchApi<{ success: boolean; data: SurveyResponse[] }>("/api/v1/feedback/responses").then(r => r.data),
  });
}

export function useFeedback(id: string) {
  return useQuery({
    queryKey: ["feedback", "responses", id],
    queryFn: () => fetchApi<{ success: boolean; data: SurveyResponse }>(`/api/v1/feedback/responses/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useSurveyResponses(surveyId: string) {
  return useQuery({
    queryKey: ["feedback", "surveys", surveyId, "responses"],
    queryFn: () => fetchApi<{ success: boolean; data: SurveyResponse[] }>(`/api/v1/feedback/surveys/${surveyId}/responses`).then(r => r.data),
    enabled: !!surveyId,
  });
}

export function useSubmitSurveyResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ surveyId, answers }: { surveyId: string; answers: any }) => 
      fetchApi(`/api/v1/feedback/surveys/${surveyId}/responses`, { 
        method: "POST", 
        body: JSON.stringify({ answers }) 
      }),
    onSuccess: (_, { surveyId }) => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys", surveyId, "responses"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys", surveyId] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys"] });
    },
  });
}
