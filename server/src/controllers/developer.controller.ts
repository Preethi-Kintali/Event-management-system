import { Request, Response, NextFunction } from "express";
import { DeveloperService } from "../services/developer.service";

export class DeveloperController {
  static async getDashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await DeveloperService.getDashboardSummary(req.tenantId!);
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }

  static async getApiMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await DeveloperService.getApiMetrics(req.tenantId!);
      res.json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getApiKeys(req: Request, res: Response, next: NextFunction) {
    try {
      const keys = await DeveloperService.getApiKeys(req.tenantId!);
      res.json({ success: true, data: keys });
    } catch (error) {
      next(error);
    }
  }

  static async createApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const key = await DeveloperService.createApiKey(req.tenantId!, req.user!.id, req.body);
      res.status(201).json({ success: true, data: key });
    } catch (error) {
      next(error);
    }
  }

  static async revokeApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      await DeveloperService.revokeApiKey(req.tenantId!, req.params.id, req.user!.id);
      res.json({ success: true, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }

  static async getQueues(req: Request, res: Response, next: NextFunction) {
    try {
      const queues = await DeveloperService.getQueues();
      res.json({ success: true, data: queues });
    } catch (error) {
      next(error);
    }
  }

  static async getCronJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const cronJobs = await DeveloperService.getCronJobs();
      res.json({ success: true, data: cronJobs });
    } catch (error) {
      next(error);
    }
  }

  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await DeveloperService.getLogs(req.tenantId!);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }

  static async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const health = await DeveloperService.getHealth();
      res.json({ success: true, data: health });
    } catch (error) {
      next(error);
    }
  }

  static async getDeployments(req: Request, res: Response, next: NextFunction) {
    try {
      const deployments = await DeveloperService.getDeployments();
      res.json({ success: true, data: deployments });
    } catch (error) {
      next(error);
    }
  }
}
