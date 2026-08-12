import { Request, Response, NextFunction } from "express";
import { CommunityService } from "../services/community.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class CommunityController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await CommunityService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  // Groups
  static async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await CommunityService.getGroups(req.tenantId!);
      res.json({ success: true, data: groups });
    } catch (error) { next(error); }
  }

  static async getGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await CommunityService.getGroupById(req.params.id, req.tenantId!);
      if (!group) return res.status(404).json({ success: false, error: { message: "Group not found" } });
      res.json({ success: true, data: group });
    } catch (error) { next(error); }
  }

  static async createGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await CommunityService.createGroup(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: group });
    } catch (error) { next(error); }
  }

  static async updateGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await CommunityService.updateGroup(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: group });
    } catch (error) { next(error); }
  }

  static async deleteGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CommunityService.deleteGroup(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Memberships
  static async getMemberships(req: Request, res: Response, next: NextFunction) {
    try {
      const memberships = await CommunityService.getMemberships(req.params.id, req.tenantId!);
      res.json({ success: true, data: memberships });
    } catch (error) { next(error); }
  }

  static async joinGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const membership = await CommunityService.joinGroup(req.params.id, req.user!.id, req.tenantId!);
      res.status(201).json({ success: true, data: membership });
    } catch (error) { next(error); }
  }

  static async leaveGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CommunityService.leaveGroup(req.params.id, req.user!.id, req.tenantId!);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Discussions
  static async getDiscussions(req: Request, res: Response, next: NextFunction) {
    try {
      const discussions = await CommunityService.getDiscussions(req.tenantId!);
      res.json({ success: true, data: discussions });
    } catch (error) { next(error); }
  }

  static async getDiscussionById(req: Request, res: Response, next: NextFunction) {
    try {
      const discussion = await CommunityService.getDiscussionById(req.params.id, req.tenantId!);
      if (!discussion) return res.status(404).json({ success: false, error: { message: "Discussion not found" } });
      res.json({ success: true, data: discussion });
    } catch (error) { next(error); }
  }

  static async createDiscussion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const discussion = await CommunityService.createDiscussion(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: discussion });
    } catch (error) { next(error); }
  }

  static async updateDiscussion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const discussion = await CommunityService.updateDiscussion(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: discussion });
    } catch (error) { next(error); }
  }

  static async deleteDiscussion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await CommunityService.deleteDiscussion(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Replies
  static async replyToDiscussion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ success: false, error: { message: "Content is required" } });
      
      const reply = await CommunityService.replyToDiscussion(req.params.id, content, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: reply });
    } catch (error) { next(error); }
  }
}
