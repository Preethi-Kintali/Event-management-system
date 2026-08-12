import { Request, Response, NextFunction } from "express";
import { FeedbackService } from "../services/feedback.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class FeedbackController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await FeedbackService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  // Surveys
  static async getSurveys(req: Request, res: Response, next: NextFunction) {
    try {
      const surveys = await FeedbackService.getSurveys(req.tenantId!);
      res.json({ success: true, data: surveys });
    } catch (error) { next(error); }
  }

  static async getSurveyById(req: Request, res: Response, next: NextFunction) {
    try {
      const survey = await FeedbackService.getSurveyById(req.params.id, req.tenantId!);
      if (!survey) return res.status(404).json({ success: false, error: { message: "Survey not found" } });
      res.json({ success: true, data: survey });
    } catch (error) { next(error); }
  }

  static async createSurvey(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const survey = await FeedbackService.createSurvey(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: survey });
    } catch (error) { next(error); }
  }

  static async updateSurvey(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const survey = await FeedbackService.updateSurvey(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: survey });
    } catch (error) { next(error); }
  }

  static async deleteSurvey(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await FeedbackService.deleteSurvey(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Responses
  static async getResponses(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await FeedbackService.getResponses(req.params.id, req.tenantId!);
      res.json({ success: true, data: responses });
    } catch (error) { next(error); }
  }

  static async submitResponse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await FeedbackService.submitResponse(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: response });
    } catch (error) { next(error); }
  }

  static async getFeedbackList(req: Request, res: Response, next: NextFunction) {
    try {
      const feedback = await FeedbackService.getFeedbackList(req.tenantId!);
      res.json({ success: true, data: feedback });
    } catch (error) { next(error); }
  }

  static async getFeedbackById(req: Request, res: Response, next: NextFunction) {
    try {
      const feedback = await FeedbackService.getFeedbackById(req.params.id, req.tenantId!);
      if (!feedback) return res.status(404).json({ success: false, error: { message: "Feedback not found" } });
      res.json({ success: true, data: feedback });
    } catch (error) { next(error); }
  }
}
