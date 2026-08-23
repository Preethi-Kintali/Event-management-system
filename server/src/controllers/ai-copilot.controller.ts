import { Request, Response, NextFunction } from "express";
import { AICopilotService } from "../services/ai-copilot.service";

export class AICopilotController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AICopilotService.getUsageSummary(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getRecentRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AICopilotService.getRecentRequests(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: { message: "Message is required" } });
      }

      const data = await AICopilotService.handleChat(req.tenantId!, req.user!.id, message, context);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async generateEventDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await AICopilotService.generateEventDescription(req.tenantId!, req.user!.id, payload);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async generateEventRules(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await AICopilotService.generateEventRules(req.tenantId!, req.user!.id, payload);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
  static async generateEvaluationRubric(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await AICopilotService.generateEvaluationRubric(req.tenantId!, req.user!.id, payload);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async generateEmailTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await AICopilotService.generateEmailTemplate(req.tenantId!, req.user!.id, payload);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async generateInsightsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const data = await AICopilotService.generateInsightsReport(req.tenantId!, req.user!.id, payload);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getInsightsReports(req: Request, res: Response, next: NextFunction) {
    try {
      // Actually we need this method in the service as well, but for now just prisma query
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const data = await prisma.aIInsightsReport.findMany({
        where: { organizationId: req.tenantId! },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
