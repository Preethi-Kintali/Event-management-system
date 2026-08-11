import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class UserController {
  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getMe(req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateMe(req.user!.id, req.body);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAll();
      res.json({ success: true, data: users });
    } catch (error) { next(error); }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getById(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.update(req.params.id, req.body, req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateStatus(req.params.id, req.body.status, req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) { next(error); }
  }
}
