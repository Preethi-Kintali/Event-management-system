import { Response, NextFunction } from "express";
import { CommunicationService } from "../services/communications.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class CommunicationController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const data = await CommunicationService.getAll(tenantId, { page, limit });
      res.json({ success: true, ...data });
    } catch (error) { next(error); }
  }

  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.getDashboardSummary(tenantId);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.getById(req.params.id, tenantId);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.create(tenantId, req.user!.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.update(tenantId, req.user!.id, req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      await CommunicationService.delete(tenantId, req.user!.id, req.params.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  static async publish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.publish(tenantId, req.user!.id, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async archive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string;
      const data = await CommunicationService.archive(tenantId, req.user!.id, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
