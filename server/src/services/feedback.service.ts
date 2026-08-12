import { FeedbackRepository } from "../repositories/feedback.repository";
import { AuditService } from "./audit.service";
import { Survey, SurveyQuestion, SurveyResponse } from "@prisma/client";

export class FeedbackService {
  static async getSurveys(organizationId: string): Promise<Survey[]> {
    return FeedbackRepository.findSurveys(organizationId);
  }

  static async getSurveyById(id: string, organizationId: string): Promise<Survey | null> {
    return FeedbackRepository.findSurveyById(id, organizationId);
  }

  static async createSurvey(data: any, organizationId: string, actorId: string): Promise<Survey> {
    const survey = await FeedbackRepository.createSurvey({
      ...data,
      organizationId,
    });
    
    // Add questions if provided
    if (data.questions && Array.isArray(data.questions)) {
      for (const [index, q] of data.questions.entries()) {
        await FeedbackRepository.createQuestion({
          surveyId: survey.id,
          text: q.text,
          type: q.type,
          order: index,
        });
      }
    }

    await AuditService.log(organizationId, actorId, "SURVEY_CREATE", survey.id);
    return survey;
  }

  static async updateSurvey(id: string, data: any, organizationId: string, actorId: string): Promise<Survey> {
    const survey = await FeedbackRepository.updateSurvey(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "SURVEY_UPDATE", survey.id);
    return survey;
  }

  static async deleteSurvey(id: string, organizationId: string, actorId: string): Promise<void> {
    await FeedbackRepository.deleteSurvey(id, organizationId);
    await AuditService.log(organizationId, actorId, "SURVEY_DELETE", id);
  }

  static async getResponses(surveyId: string, organizationId: string): Promise<SurveyResponse[]> {
    // Validate survey belongs to organization
    const survey = await FeedbackRepository.findSurveyById(surveyId, organizationId);
    if (!survey) throw { status: 404, code: "NOT_FOUND", message: "Survey not found" };

    return FeedbackRepository.findResponses(surveyId);
  }

  static async submitResponse(surveyId: string, data: any, organizationId: string, actorId: string): Promise<SurveyResponse> {
    const survey = await FeedbackRepository.findSurveyById(surveyId, organizationId);
    if (!survey) throw { status: 404, code: "NOT_FOUND", message: "Survey not found" };

    return FeedbackRepository.createResponse({
      surveyId,
      participantId: actorId,
      sentiment: data.sentiment || "Neutral",
      rating: data.rating,
      comments: data.comments,
    });
  }

  static async getFeedbackList(organizationId: string): Promise<SurveyResponse[]> {
    return FeedbackRepository.findFeedbackList(organizationId);
  }

  static async getFeedbackById(id: string, organizationId: string): Promise<SurveyResponse | null> {
    return FeedbackRepository.findFeedbackById(id, organizationId);
  }

  static async getDashboardStats(organizationId: string) {
    const feedbackList = await FeedbackRepository.findFeedbackList(organizationId);
    
    let totalFeedback = feedbackList.length;
    let totalRating = 0;
    let positiveCount = 0;
    let actionableCount = 0;

    feedbackList.forEach(f => {
      if (f.rating) totalRating += f.rating;
      if (f.sentiment === "Positive") positiveCount++;
      if (f.comments && f.comments.length > 20) actionableCount++; // Simple heuristic
    });

    return {
      totalResponses: totalFeedback,
      averageSatisfaction: totalFeedback > 0 ? (totalRating / totalFeedback).toFixed(1) : 0,
      positiveSentiment: totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : 0,
      actionableInsights: actionableCount,
    };
  }
}
