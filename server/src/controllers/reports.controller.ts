import { Request, Response, NextFunction } from "express";
import { ReportsService } from "../services/reports.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class ReportsController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ReportsService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  // Generic handler for JSON lists
  private static async getList(req: Request, res: Response, next: NextFunction, serviceMethod: Function) {
    try {
      const filters = req.query;
      const data = await serviceMethod.call(ReportsService, req.tenantId!, filters);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  // Generic handler for CSV export
  private static async exportList(req: AuthRequest, res: Response, next: NextFunction, reportType: string) {
    try {
      const filters = req.query;
      const format = (filters.format as string) || "csv";
      
      if (format !== "csv") {
        return res.status(400).json({ success: false, error: { message: "Only CSV format is supported currently" } });
      }

      const csvString = await ReportsService.exportToCSV(req.tenantId!, req.user!.id, reportType, filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvString);
    } catch (error) { next(error); }
  }

  // Event
  static async getEventReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getEventReports);
  }
  static async exportEventReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "events");
  }

  // Competition
  static async getCompetitionReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getCompetitionReports);
  }
  static async exportCompetitionReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "competitions");
  }

  // Participant
  static async getParticipantReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getParticipantReports);
  }
  static async exportParticipantReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "participants");
  }

  // Evaluation
  static async getEvaluationReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getEvaluationReports);
  }
  static async exportEvaluationReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "evaluations");
  }

  // Attendance
  static async getAttendanceReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getAttendanceReports);
  }
  static async exportAttendanceReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "attendance");
  }

  // Certificate
  static async getCertificateReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getCertificateReports);
  }
  static async exportCertificateReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "certificates");
  }

  // Winner
  static async getWinnerReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getWinnerReports);
  }
  static async exportWinnerReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "winners");
  }

  // Communication
  static async getCommunicationReports(req: Request, res: Response, next: NextFunction) {
    await ReportsController.getList(req, res, next, ReportsService.getCommunicationReports);
  }
  static async exportCommunicationReports(req: AuthRequest, res: Response, next: NextFunction) {
    await ReportsController.exportList(req, res, next, "communications");
  }
}
