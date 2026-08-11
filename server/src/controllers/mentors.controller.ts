import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MentorService } from "../services/mentors.service";

export class MentorController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MentorService.getMentors(req.tenantId as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MentorService.getMentor(req.tenantId as string, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MentorService.createMentor(req.tenantId as string, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MentorService.updateMentor(req.tenantId as string, req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await MentorService.deleteMentor(req.tenantId as string, req.params.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  static async assignTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await MentorService.assignTeam(
        req.tenantId as string,
        req.params.id,
        req.body.teamId
      );
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async removeTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await MentorService.removeTeam(
        req.tenantId as string,
        req.params.id,
        req.params.teamId
      );
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
