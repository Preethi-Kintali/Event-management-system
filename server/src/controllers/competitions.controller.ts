import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { CompetitionService } from "../services/competitions.service";

export class CompetitionController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const comps = await CompetitionService.getCompetitions(tenantId);
      res.json({ success: true, data: comps });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const comp = await CompetitionService.getCompetition(tenantId, req.params.id);
      res.json({ success: true, data: comp });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const comp = await CompetitionService.createCompetition(tenantId, req.body);
      res.status(201).json({ success: true, data: comp });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const comp = await CompetitionService.updateCompetition(tenantId, req.params.id, req.body);
      res.json({ success: true, data: comp });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      await CompetitionService.deleteCompetition(tenantId, req.params.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  }

  static async getCompetitionDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const dashboard = await CompetitionService.getCompetitionDashboard(tenantId, req.params.id);
      res.json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }
}
