import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login({
        ...req.body,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw { status: 401, code: "UNAUTHORIZED", message: "Missing user context" };
      const user = await AuthService.getMe(req.user.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async verifyMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyMfaChallenge(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
