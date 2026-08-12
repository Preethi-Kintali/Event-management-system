import { Request, Response, NextFunction } from "express";
import { SponsorsService } from "../services/sponsors.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class SponsorsController {
  // Sponsors
  static async getSponsors(req: Request, res: Response, next: NextFunction) {
    try {
      const sponsors = await SponsorsService.getSponsors(req.tenantId!);
      res.json({ success: true, data: sponsors });
    } catch (error) { next(error); }
  }

  static async getSponsorById(req: Request, res: Response, next: NextFunction) {
    try {
      const sponsor = await SponsorsService.getSponsorById(req.params.id, req.tenantId!);
      if (!sponsor) return res.status(404).json({ success: false, error: { message: "Sponsor not found" } });
      res.json({ success: true, data: sponsor });
    } catch (error) { next(error); }
  }

  static async createSponsor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sponsor = await SponsorsService.createSponsor(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: sponsor });
    } catch (error) { next(error); }
  }

  static async updateSponsor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sponsor = await SponsorsService.updateSponsor(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: sponsor });
    } catch (error) { next(error); }
  }

  static async deleteSponsor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await SponsorsService.deleteSponsor(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Sponsorships
  static async getSponsorships(req: Request, res: Response, next: NextFunction) {
    try {
      const sponsorships = await SponsorsService.getSponsorships(req.params.id, req.tenantId!);
      res.json({ success: true, data: sponsorships });
    } catch (error) { next(error); }
  }

  static async addSponsorship(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.body;
      if (!eventId) return res.status(400).json({ success: false, error: { message: "eventId is required" } });

      const sponsorship = await SponsorsService.addSponsorship(req.params.id, eventId, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: sponsorship });
    } catch (error) { next(error); }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await SponsorsService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }
}
