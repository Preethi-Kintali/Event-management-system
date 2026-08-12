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

  static async createApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, environment, expiresInDays } = req.body;
      const data = await IntegrationsService.createApiKey(req.tenantId!, name, environment, req.user!.id, expiresInDays);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async revokeApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await IntegrationsService.revokeApiKey(req.tenantId!, req.params.id, req.user!.id);
      res.json({ success });
    } catch (error) { next(error); }
  }

  static async getWebhooks(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getWebhooks(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async createWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, endpoint, events } = req.body;
      const data = await IntegrationsService.createWebhook(req.tenantId!, name, endpoint, events, req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async updateWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.updateWebhook(req.tenantId!, req.params.id, req.body, req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async deleteWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await IntegrationsService.deleteWebhook(req.tenantId!, req.params.id, req.user!.id);
      res.json({ success });
    } catch (error) { next(error); }
  }

  static async getWebhookDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.getWebhookDeliveries(req.tenantId!, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async pingWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await IntegrationsService.pingWebhook(req.tenantId!, req.params.id, req.user!.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}

