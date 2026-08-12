import { Request, Response, NextFunction } from "express";
import { WorkflowsService } from "../services/workflows.service";

export class WorkflowsController {
  static async getWorkflows(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowsService.getWorkflows(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowsService.getWorkflowDashboard(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getExecutions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowsService.getWorkflowExecutions(req.tenantId!);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }

  static async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowsService.getWorkflowTemplates();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  }
}
