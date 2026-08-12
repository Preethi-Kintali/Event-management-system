import { LearningRepository } from "../repositories/learning.repository";
import { AuditService } from "./audit.service";
import { Course, CourseEnrollment, LearningResource, Workshop } from "@prisma/client";

export class LearningService {
  static async getCourses(organizationId: string): Promise<Course[]> {
    return LearningRepository.findCourses(organizationId);
  }

  static async getCourseById(id: string, organizationId: string): Promise<Course | null> {
    return LearningRepository.findCourseById(id, organizationId);
  }

  static async createCourse(data: any, organizationId: string, actorId: string): Promise<Course> {
    const course = await LearningRepository.createCourse({
      ...data,
      organizationId,
    });
    await AuditService.log(organizationId, actorId, "COURSE_CREATE", course.id);
    return course;
  }

  static async updateCourse(id: string, data: any, organizationId: string, actorId: string): Promise<Course> {
    const course = await LearningRepository.updateCourse(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "COURSE_UPDATE", course.id);
    return course;
  }

  static async deleteCourse(id: string, organizationId: string, actorId: string): Promise<void> {
    await LearningRepository.deleteCourse(id, organizationId);
    await AuditService.log(organizationId, actorId, "COURSE_DELETE", id);
  }

  static async getEnrollments(courseId: string, organizationId: string): Promise<CourseEnrollment[]> {
    return LearningRepository.findEnrollments(courseId, organizationId);
  }

  static async enroll(courseId: string, userId: string, organizationId: string): Promise<CourseEnrollment> {
    // Validate course exists
    const course = await LearningRepository.findCourseById(courseId, organizationId);
    if (!course) throw { status: 404, code: "NOT_FOUND", message: "Course not found" };

    return LearningRepository.createEnrollment({
      courseId,
      userId,
      status: "ENROLLED",
      progress: 0,
    });
  }

  static async updateEnrollment(courseId: string, userId: string, data: any): Promise<CourseEnrollment> {
    return LearningRepository.updateEnrollment(courseId, userId, data);
  }

  static async getResources(organizationId: string): Promise<LearningResource[]> {
    return LearningRepository.findResources(organizationId);
  }

  static async createResource(data: any, organizationId: string, actorId: string): Promise<LearningResource> {
    const resource = await LearningRepository.createResource({
      ...data,
      organizationId,
      uploadedById: actorId,
    });
    await AuditService.log(organizationId, actorId, "RESOURCE_CREATE", resource.id);
    return resource;
  }

  static async updateResource(id: string, data: any, organizationId: string, actorId: string): Promise<LearningResource> {
    const resource = await LearningRepository.updateResource(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "RESOURCE_UPDATE", resource.id);
    return resource;
  }

  static async deleteResource(id: string, organizationId: string, actorId: string): Promise<void> {
    await LearningRepository.deleteResource(id, organizationId);
    await AuditService.log(organizationId, actorId, "RESOURCE_DELETE", id);
  }

  static async getWorkshops(organizationId: string): Promise<Workshop[]> {
    return LearningRepository.findWorkshops(organizationId);
  }

  static async createWorkshop(data: any, organizationId: string, actorId: string): Promise<Workshop> {
    const workshop = await LearningRepository.createWorkshop({
      ...data,
      date: new Date(data.date),
      organizationId,
    });
    await AuditService.log(organizationId, actorId, "WORKSHOP_CREATE", workshop.id);
    return workshop;
  }

  static async updateWorkshop(id: string, data: any, organizationId: string, actorId: string): Promise<Workshop> {
    if (data.date) {
      data.date = new Date(data.date);
    }
    const workshop = await LearningRepository.updateWorkshop(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "WORKSHOP_UPDATE", workshop.id);
    return workshop;
  }

  static async deleteWorkshop(id: string, organizationId: string, actorId: string): Promise<void> {
    await LearningRepository.deleteWorkshop(id, organizationId);
    await AuditService.log(organizationId, actorId, "WORKSHOP_DELETE", id);
  }

  static async getDashboardStats(organizationId: string) {
    const courses = await LearningRepository.findCourses(organizationId);
    const resources = await LearningRepository.findResources(organizationId);
    
    let totalLearners = 0;
    let completedEnrollments = 0;
    let totalEnrollments = 0;

    courses.forEach(c => {
      const enrollments = c.enrollments || [];
      totalEnrollments += enrollments.length;
      completedEnrollments += enrollments.filter(e => e.status === "COMPLETED" || e.progress === 100).length;
      totalLearners += enrollments.length; // Simplified for now
    });

    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    return {
      courses: courses.length,
      resources: resources.length,
      activeLearners: totalLearners,
      completionRate,
    };
  }
}
