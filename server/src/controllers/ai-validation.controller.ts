import { Request, Response, NextFunction } from "express";
import { AIValidationService } from "../services/ai-validation.service";

export class AIValidationController {
  static async getValidationQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AIValidationService.getValidationQueue(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AIValidationService.getValidationSummary(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
