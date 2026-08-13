import { Request, Response, NextFunction } from "express";
import { PlatformAdminService } from "../services/platform-admin.service";

export const PlatformAdminController = {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await PlatformAdminService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  },

  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await PlatformAdminService.getTimeline();
      res.json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  },

  async getSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const subscriptions = await PlatformAdminService.getSubscriptions();
      res.json({ success: true, data: subscriptions });
    } catch (error) {
      next(error);
    }
  },

  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await PlatformAdminService.getAuditLogs();
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }
};
