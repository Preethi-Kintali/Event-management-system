import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { SecurityService } from "../services/security.service";

export class SecurityController {
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const data = await SecurityService.getSecurityDashboard(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPolicy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const data = await SecurityService.getSecurityPolicy(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updatePolicy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const actorId = req.user!.id;
      const data = await SecurityService.updateSecurityPolicy(tenantId, actorId, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const data = await SecurityService.getActiveSessions(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async revokeSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const actorId = req.user!.id;
      const { id } = req.params;
      const data = await SecurityService.revokeSession(tenantId, actorId, id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async revokeAllOtherSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const userId = req.user!.id;
      const keepSessionId = (req.user as any).sessionId;
      if (!keepSessionId) {
        throw { status: 400, message: "Current session ID not found in token." };
      }
      const data = await SecurityService.revokeAllOtherSessions(tenantId, userId, keepSessionId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const data = await SecurityService.getSecurityEvents(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async setupMfa(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const userId = req.user!.id;
      const data = await SecurityService.setupMfa(tenantId, userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async verifySetupMfa(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const userId = req.user!.id;
      const data = await SecurityService.verifySetupMfa(tenantId, userId, req.body.code);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async disableMfa(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      const actorId = req.user!.id;
      // If targetUserId is not provided, disable for the caller
      const targetUserId = req.body.userId || actorId;
      const data = await SecurityService.disableMfa(tenantId, actorId, targetUserId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
