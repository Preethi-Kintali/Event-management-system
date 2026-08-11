import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/organizations.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class OrganizationController {
  // Organizations
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orgs = await OrganizationService.getAll();
      res.json({ success: true, data: orgs });
    } catch (error) { next(error); }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await OrganizationService.getById(req.params.id);
      res.json({ success: true, data: org });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await OrganizationService.create(req.body, req.user!.id);
      res.status(201).json({ success: true, data: org });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await OrganizationService.update(req.params.id, req.body, req.user!.id);
      res.json({ success: true, data: org });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await OrganizationService.delete(req.params.id, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Members
  static async findMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await OrganizationService.getMembers(req.params.id);
      res.json({ success: true, data: members });
    } catch (error) { next(error); }
  }

  static async addMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, roleId } = req.body;
      const member = await OrganizationService.addMember(req.params.id, email, roleId, req.user!.id);
      res.status(201).json({ success: true, data: member });
    } catch (error) { next(error); }
  }

  static async updateMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const member = await OrganizationService.updateMember(req.params.id, req.params.memberId, req.body, req.user!.id);
      res.json({ success: true, data: member });
    } catch (error) { next(error); }
  }

  static async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await OrganizationService.removeMember(req.params.id, req.params.memberId, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
