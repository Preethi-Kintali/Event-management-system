import { Request, Response, NextFunction } from "express";
import { RecruitmentService } from "../services/recruitment.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class RecruitmentController {
  // Jobs
  static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await RecruitmentService.getJobs(req.tenantId!);
      res.json({ success: true, data: jobs });
    } catch (error) { next(error); }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await RecruitmentService.getJobById(req.params.id, req.tenantId!);
      if (!job) return res.status(404).json({ success: false, error: { message: "Job not found" } });
      res.json({ success: true, data: job });
    } catch (error) { next(error); }
  }

  static async createJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await RecruitmentService.createJob(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: job });
    } catch (error) { next(error); }
  }

  static async updateJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await RecruitmentService.updateJob(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: job });
    } catch (error) { next(error); }
  }

  static async deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await RecruitmentService.deleteJob(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Applications
  static async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await RecruitmentService.getApplications(req.tenantId!);
      res.json({ success: true, data: apps });
    } catch (error) { next(error); }
  }

  static async updateApplicationStage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { stage } = req.body;
      if (!stage) return res.status(400).json({ success: false, error: { message: "Stage is required" } });
      
      const app = await RecruitmentService.updateApplicationStage(req.params.id, stage, req.tenantId!, req.user!.id);
      res.json({ success: true, data: app });
    } catch (error) { next(error); }
  }

  // Phase 4D: Candidates (which are fundamentally JobApplications in our schema)
  static async getCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await RecruitmentService.getApplications(req.tenantId!);
      // Map them to the shape expected by the frontend
      const candidates = apps.map(app => ({
        id: app.id,
        participantId: app.candidateId,
        participant: app.candidate,
        role: app.job?.title,
        company: app.job?.company,
        stage: app.stage,
        score: app.score,
        source: app.source || "Application",
        status: app.stage === "REJECTED" ? "REJECTED" : (app.stage === "OFFER_ACCEPTED" ? "HIRED" : "ACTIVE"),
      }));
      res.json({ success: true, data: candidates });
    } catch (error) { next(error); }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await RecruitmentService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  static async createCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Create candidate is fundamentally creating a JobApplication
      // The frontend sends candidateId, jobId, stage, source etc.
      const app = await RecruitmentService.createApplication(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: app });
    } catch (error) { next(error); }
  }
}
