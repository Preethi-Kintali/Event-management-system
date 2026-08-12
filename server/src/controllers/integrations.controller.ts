import { Request, Response, NextFunction } from "express";
import { IntegrationsService } from "../services/integrations.service";

export class IntegrationsController {
  static async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getIntegrations(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getIntegrationDashboard(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getApiKeys(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getApiKeys(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getWebhooks(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getWebhooks(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
