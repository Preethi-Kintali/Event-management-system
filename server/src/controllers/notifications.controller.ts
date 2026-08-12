import { Response, NextFunction } from "express";
import { NotificationService } from "../services/notifications.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class NotificationController {
  static async findMy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const data = await NotificationService.getForUser(req.user!.id, tenantId, { page, limit });
      res.json({ success: true, ...data });
    } catch (error) { next(error); }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await NotificationService.markAsRead(req.params.id, req.user!.id, tenantId);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      await NotificationService.markAllAsRead(req.user!.id, tenantId);
      res.json({ success: true, data: { readAll: true } });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      await NotificationService.delete(req.params.id, req.user!.id, tenantId);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
