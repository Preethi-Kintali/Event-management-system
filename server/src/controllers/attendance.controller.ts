import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceMethod, AttendanceStatus } from "@prisma/client";

export class AttendanceController {
  // Dashboard
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getDashboardSummary(req.tenantId as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // Sessions
  static async getSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getSessions(req.tenantId as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getSession(req.tenantId as string, req.params.id);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async createSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.createSession(req.tenantId as string, {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async updateSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.updateSession(
        req.tenantId as string,
        req.params.id,
        req.body
      );
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // Records
  static async getRecords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttendanceService.getRecords(req.tenantId as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async checkIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, userId, method, status } = req.body;
      const data = await AttendanceService.checkIn(
        req.tenantId as string,
        sessionId,
        userId,
        method as AttendanceMethod | undefined,
        status as AttendanceStatus | undefined
      );
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async checkOut(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, userId } = req.body;
      const data = await AttendanceService.checkOut(req.tenantId as string, sessionId, userId);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
