import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { EventService } from "../services/events.service";

export class EventController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const events = await EventService.getEvents(tenantId);
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const event = await EventService.getEvent(tenantId, req.params.id);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const event = await EventService.createEvent(tenantId, req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      const event = await EventService.updateEvent(tenantId, req.params.id, req.body);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId as string;
      await EventService.deleteEvent(tenantId, req.params.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  }
}
