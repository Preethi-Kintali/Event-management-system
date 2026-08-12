import { PrismaClient, Course, CourseEnrollment, LearningResource, Workshop } from "@prisma/client";

const prisma = new PrismaClient();

export class LearningRepository {
  // Courses
  static async findCourses(organizationId: string) {
    return prisma.course.findMany({
      where: { organizationId },
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        enrollments: true,
        _count: { select: { enrollments: true } },
      },
    });
  }

  static async findCourseById(id: string, organizationId: string): Promise<Course | null> {
    return prisma.course.findUnique({
      where: { id, organizationId },
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        _count: { select: { enrollments: true } },
      },
    });
  }

  static async createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
    return prisma.course.create({ data });
  }

  static async updateCourse(id: string, organizationId: string, data: Partial<Course>): Promise<Course> {
    return prisma.course.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteCourse(id: string, organizationId: string): Promise<void> {
    await prisma.course.delete({ where: { id, organizationId } });
  }

  // Course Enrollments
  static async findEnrollments(courseId: string, organizationId: string): Promise<CourseEnrollment[]> {
    // Ensure course belongs to organization
    const course = await prisma.course.findUnique({ where: { id: courseId, organizationId } });
    if (!course) return [];
    return prisma.courseEnrollment.findMany({
      where: { courseId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  static async createEnrollment(data: Omit<CourseEnrollment, "id" | "enrolledAt" | "updatedAt">): Promise<CourseEnrollment> {
    return prisma.courseEnrollment.create({ data });
  }

  static async updateEnrollment(courseId: string, userId: string, data: Partial<CourseEnrollment>): Promise<CourseEnrollment> {
    return prisma.courseEnrollment.update({
      where: { courseId_userId: { courseId, userId } },
      data,
    });
  }

  // Resources
  static async findResources(organizationId: string): Promise<LearningResource[]> {
    return prisma.learningResource.findMany({
      where: { organizationId },
      include: { uploadedBy: { select: { firstName: true, lastName: true } } },
    });
  }

  static async createResource(data: Omit<LearningResource, "id" | "downloads" | "createdAt" | "updatedAt">): Promise<LearningResource> {
    return prisma.learningResource.create({ data });
  }

  static async updateResource(id: string, organizationId: string, data: Partial<LearningResource>): Promise<LearningResource> {
    return prisma.learningResource.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteResource(id: string, organizationId: string): Promise<void> {
    await prisma.learningResource.delete({ where: { id, organizationId } });
  }

  // Workshops
  static async findWorkshops(organizationId: string): Promise<Workshop[]> {
    return prisma.workshop.findMany({
      where: { organizationId },
      include: { instructor: { select: { firstName: true, lastName: true } } },
    });
  }

  static async createWorkshop(data: Omit<Workshop, "id" | "createdAt" | "updatedAt">): Promise<Workshop> {
    return prisma.workshop.create({ data });
  }

  static async updateWorkshop(id: string, organizationId: string, data: Partial<Workshop>): Promise<Workshop> {
    return prisma.workshop.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteWorkshop(id: string, organizationId: string): Promise<void> {
    await prisma.workshop.delete({ where: { id, organizationId } });
  }
}
