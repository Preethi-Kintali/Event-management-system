import { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/roles.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class RoleController {
  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string | undefined;
      const roles = await RoleService.getAll(tenantId);
      res.json({ success: true, data: roles });
    } catch (error) { next(error); }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.getById(req.params.id);
      res.json({ success: true, data: role });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string | undefined;
      const role = await RoleService.create(tenantId || null, req.body, req.user!.id);
      res.status(201).json({ success: true, data: role });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string | undefined;
      const role = await RoleService.update(tenantId || null, req.params.id, req.body, req.user!.id);
      res.json({ success: true, data: role });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tenantId = req.headers["x-organization-id"] as string | undefined;
      await RoleService.delete(tenantId || null, req.params.id, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await RoleService.getPermissions();
      res.json({ success: true, data: permissions });
    } catch (error) { next(error); }
  }
}
