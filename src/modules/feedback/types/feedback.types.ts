export type Sentiment = "Positive" | "Neutral" | "Negative";
export type SurveyStatus = "Draft" | "Published" | "Closed";

export interface Feedback {
  id: string;
  participant: string;
  event: string;
  rating: number;
  sentiment: Sentiment;
  category: string;
  comments: string;
  submittedDate: string;
  status: "Reviewed" | "Pending";
}

export interface Survey {
  id: string;
  name: string;
  event: string;
  audience: string;
  questions: number;
  responses: number;
  responseRate: number;
  status: SurveyStatus;
}

export interface FeedbackDashboardSummary {
  totalResponses: number;
  responseRate: number;
  averageRating: number;
  positiveFeedback: number;
  negativeFeedback: number;
  pendingSurveys: number;
}
