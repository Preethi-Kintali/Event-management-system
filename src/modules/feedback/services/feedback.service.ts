import { Feedback, Survey, FeedbackDashboardSummary } from "../types/feedback.types";

export const FeedbackService = {
  async getDashboardSummary(): Promise<FeedbackDashboardSummary> {
    return {
      totalResponses: 14200,
      responseRate: 68.4,
      averageRating: 4.6,
      positiveFeedback: 88,
      negativeFeedback: 4,
      pendingSurveys: 12,
    };
  },

  async getFeedbackList(): Promise<Feedback[]> {
    return [
      {
        id: "fb_1",
        participant: "John Doe",
        event: "Global AI Summit",
        rating: 5,
        sentiment: "Positive",
        category: "Content",
        comments: "Amazing sessions and great networking!",
        submittedDate: "2026-08-10",
        status: "Reviewed",
      },
      {
        id: "fb_2",
        participant: "Alice Smith",
        event: "Hack the Campus",
        rating: 3,
        sentiment: "Neutral",
        category: "Logistics",
        comments: "Food could be better, but hackathon was fun.",
        submittedDate: "2026-08-09",
        status: "Pending",
      },
      {
        id: "fb_3",
        participant: "Bob Johnson",
        event: "Design Challenge",
        rating: 4,
        sentiment: "Positive",
        category: "Mentorship",
        comments: "Mentors were really helpful.",
        submittedDate: "2026-08-08",
        status: "Reviewed",
      },
      {
        id: "fb_4",
        participant: "Charlie Brown",
        event: "Global AI Summit",
        rating: 2,
        sentiment: "Negative",
        category: "Technical",
        comments: "WiFi was down for 2 hours.",
        submittedDate: "2026-08-07",
        status: "Pending",
      },
    ];
  },

  async getFeedbackById(id: string): Promise<Feedback | undefined> {
    const list = await this.getFeedbackList();
    return list.find((f) => f.id === id) || list[0];
  },

  async getSurveys(): Promise<Survey[]> {
    return [
      {
        id: "surv_1",
        name: "Post-Event Satisfaction",
        event: "Global AI Summit",
        audience: "All Participants",
        questions: 10,
        responses: 4500,
        responseRate: 72,
        status: "Closed",
      },
      {
        id: "surv_2",
        name: "Mentor Evaluation",
        event: "Hack the Campus",
        audience: "Teams",
        questions: 5,
        responses: 320,
        responseRate: 85,
        status: "Published",
      },
      {
        id: "surv_3",
        name: "Session Feedback: Keynote",
        event: "Global AI Summit",
        audience: "Attendees",
        questions: 3,
        responses: 1200,
        responseRate: 64,
        status: "Published",
      },
      {
        id: "surv_4",
        name: "Mid-Year Check-in",
        event: "Platform Wide",
        audience: "All Users",
        questions: 8,
        responses: 0,
        responseRate: 0,
        status: "Draft",
      },
    ];
  },
};
