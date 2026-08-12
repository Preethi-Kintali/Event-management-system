import { PrismaClient, JobPosting, JobApplication } from "@prisma/client";

const prisma = new PrismaClient();

export class RecruitmentRepository {
  // Jobs
  static async findJobs(organizationId: string): Promise<JobPosting[]> {
    return prisma.jobPosting.findMany({
      where: { organizationId },
      include: {
        _count: { select: { applications: true } },
      },
    });
  }

  static async findJobById(id: string, organizationId: string): Promise<JobPosting | null> {
    return prisma.jobPosting.findUnique({
      where: { id, organizationId },
      include: {
        _count: { select: { applications: true } },
      },
    });
  }

  static async createJob(data: Omit<JobPosting, "id" | "createdAt" | "updatedAt">): Promise<JobPosting> {
    return prisma.jobPosting.create({ data });
  }

  static async updateJob(id: string, organizationId: string, data: Partial<JobPosting>): Promise<JobPosting> {
    return prisma.jobPosting.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteJob(id: string, organizationId: string): Promise<void> {
    await prisma.jobPosting.delete({ where: { id, organizationId } });
  }

  // Applications
  static async findApplications(organizationId: string): Promise<JobApplication[]> {
    return prisma.jobApplication.findMany({
      where: { job: { organizationId } },
      include: {
        job: { select: { title: true, company: true } },
        candidate: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { score: "desc" },
    });
  }

  static async updateApplicationStage(id: string, stage: string): Promise<JobApplication> {
    return prisma.jobApplication.update({
      where: { id },
      data: { stage },
    });
  }
}
