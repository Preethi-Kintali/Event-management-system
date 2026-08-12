import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AIValidationService {
  static async getValidationQueue(organizationId: string) {
    return prisma.aIValidationRecord.findMany({
      where: { organizationId },
      include: {
        submission: {
          include: {
            team: { select: { name: true } },
            competition: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getValidationSummary(organizationId: string) {
    const total = await prisma.aIValidationRecord.count({ where: { organizationId } });
    const validated = await prisma.aIValidationRecord.count({
      where: { organizationId, status: "passed" },
    });
    const flagged = await prisma.aIValidationRecord.count({
      where: { organizationId, status: "flagged" },
    });
    const manualReview = await prisma.aIValidationRecord.count({
      where: { organizationId, status: "manual_review" },
    });

    const records = await prisma.aIValidationRecord.findMany({
      where: { organizationId },
      select: { plagiarismScore: true, aiContentScore: true, duplicateScore: true, codeQuality: true },
    });

    const plagiarismFlags = records.filter((r) => r.plagiarismScore > 0.3).length;
    const aiContentFlags = records.filter((r) => r.aiContentScore > 0.5).length;
    const duplicateFlags = records.filter((r) => r.duplicateScore > 0.2).length;
    const codeQualityIssues = records.filter((r) => r.codeQuality < 0.6 && r.codeQuality > 0).length;

    return {
      totalSubmissions: total, // Usually should join with total submissions, but for simplicity we use total validation records
      validatedSubmissions: validated,
      flaggedSubmissions: flagged + manualReview,
      plagiarismFlags,
      aiContentFlags,
      duplicateFlags,
      codeQualityIssues,
    };
  }
}
