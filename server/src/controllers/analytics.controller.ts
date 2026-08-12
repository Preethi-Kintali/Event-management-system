import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { AuditService } from "../services/audit.service";

export class AnalyticsController {
  static async getParticipation(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getParticipationAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.participation.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getRevenue(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getRevenueAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.revenue.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getFeedback(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getFeedbackAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.feedback.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getAttendance(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getAttendanceAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.attendance.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getCertificates(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getCertificateAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.certificates.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getEvaluations(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getEvaluationAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.evaluations.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getSponsors(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getSponsorAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.sponsors.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getRecruitment(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getRecruitmentAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.recruitment.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }

  static async getAI(req: Request, res: Response) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await AnalyticsService.getAIAnalytics(tenantId);
      
      await AuditService.logAction({
        organizationId: tenantId,
        actorId: req.user!.id,
        action: "analytics.ai.read",
      });

      res.json(data);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  }
}
