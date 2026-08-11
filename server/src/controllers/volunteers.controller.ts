import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { VolunteerService } from "../services/volunteers.service";

export class VolunteerController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await VolunteerService.getVolunteers(req.tenantId as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await VolunteerService.getVolunteer(req.tenantId as string, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await VolunteerService.createVolunteer(req.tenantId as string, req.body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await VolunteerService.updateVolunteer(req.tenantId as string, req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await VolunteerService.deleteVolunteer(req.tenantId as string, req.params.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  static async assignEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId, shiftsCount, hoursCount } = req.body;
      const data = await VolunteerService.assignEvent(
        req.tenantId as string,
        req.params.id,
        eventId,
        shiftsCount,
        hoursCount
      );
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async removeEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await VolunteerService.removeEvent(
        req.tenantId as string,
        req.params.id,
        req.params.eventId
      );
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
