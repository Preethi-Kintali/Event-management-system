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
}
