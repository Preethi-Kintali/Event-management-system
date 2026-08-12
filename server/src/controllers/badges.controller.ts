import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { BadgesService } from "../services/badges.service";

export class BadgesController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const data = await BadgesService.getDashboard(req.tenantId!);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message, details: [] } });
    }
  }

  static async getBadges(req: AuthRequest, res: Response) {
    try {
      const data = await BadgesService.getBadges(req.tenantId!);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message, details: [] } });
    }
  }

  static async getBadgeById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = await BadgesService.getBadgeById(id, req.tenantId!);
      res.json({ success: true, data });
    } catch (error: any) {
      if (error.message === "Badge not found") {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: error.message, details: [] } });
      }
      res.status(500).json({ success: false, error: { message: error.message, details: [] } });
    }
  }

  static async createBadge(req: AuthRequest, res: Response) {
    try {
      const data = await BadgesService.createBadge(req.tenantId!, req.body, req.user!.id);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: error.message, details: [] } });
    }
  }

  static async awardBadge(req: AuthRequest, res: Response) {
    try {
      const data = await BadgesService.awardBadge(req.tenantId!, req.body, req.user!.id);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: error.message, details: [] } });
    }
  }

  static async getAchievements(req: AuthRequest, res: Response) {
    try {
      const data = await BadgesService.getAchievements(req.tenantId!);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message, details: [] } });
    }
  }
}
