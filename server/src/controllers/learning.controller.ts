import { Request, Response, NextFunction } from "express";
import { LearningService } from "../services/learning.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class LearningController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await LearningService.getDashboardStats(req.tenantId!);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }

  // Courses
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await LearningService.getCourses(req.tenantId!);
      res.json({ success: true, data: courses });
    } catch (error) { next(error); }
  }

  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await LearningService.getCourseById(req.params.id, req.tenantId!);
      if (!course) return res.status(404).json({ success: false, error: { message: "Course not found" } });
      res.json({ success: true, data: course });
    } catch (error) { next(error); }
  }

  static async createCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const course = await LearningService.createCourse(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: course });
    } catch (error) { next(error); }
  }

  static async updateCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const course = await LearningService.updateCourse(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: course });
    } catch (error) { next(error); }
  }

  static async deleteCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await LearningService.deleteCourse(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Course Enrollments
  static async getEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollments = await LearningService.getEnrollments(req.params.id, req.tenantId!);
      res.json({ success: true, data: enrollments });
    } catch (error) { next(error); }
  }

  static async enroll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const enrollment = await LearningService.enroll(req.params.id, req.user!.id, req.tenantId!);
      res.status(201).json({ success: true, data: enrollment });
    } catch (error) { next(error); }
  }

  static async updateEnrollment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const enrollment = await LearningService.updateEnrollment(req.params.id, req.params.userId, req.body);
      res.json({ success: true, data: enrollment });
    } catch (error) { next(error); }
  }

  // Resources
  static async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await LearningService.getResources(req.tenantId!);
      res.json({ success: true, data: resources });
    } catch (error) { next(error); }
  }

  static async createResource(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const resource = await LearningService.createResource(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: resource });
    } catch (error) { next(error); }
  }

  static async updateResource(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const resource = await LearningService.updateResource(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: resource });
    } catch (error) { next(error); }
  }

  static async deleteResource(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await LearningService.deleteResource(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }

  // Workshops
  static async getWorkshops(req: Request, res: Response, next: NextFunction) {
    try {
      const workshops = await LearningService.getWorkshops(req.tenantId!);
      res.json({ success: true, data: workshops });
    } catch (error) { next(error); }
  }

  static async createWorkshop(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workshop = await LearningService.createWorkshop(req.body, req.tenantId!, req.user!.id);
      res.status(201).json({ success: true, data: workshop });
    } catch (error) { next(error); }
  }

  static async updateWorkshop(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workshop = await LearningService.updateWorkshop(req.params.id, req.body, req.tenantId!, req.user!.id);
      res.json({ success: true, data: workshop });
    } catch (error) { next(error); }
  }

  static async deleteWorkshop(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await LearningService.deleteWorkshop(req.params.id, req.tenantId!, req.user!.id);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) { next(error); }
  }
}
