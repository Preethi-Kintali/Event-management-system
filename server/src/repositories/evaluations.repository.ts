import { prisma } from "../utils/prisma";
import { Prisma, EvaluationStatus } from "@prisma/client";

export class EvaluationRepository {
  /** List all evaluations scoped to tenant (via submission → competition → event → org) */
  static async findAll(tenantId: string) {
    return prisma.evaluation.findMany({
      where: {
        submission: { competition: { event: { organizationId: tenantId } } },
      },
      include: {
        submission: {
          select: {
            title: true,
            status: true,
            competition: { select: { name: true, event: { select: { name: true } } } },
            team: { select: { name: true } },
          },
        },
        judge: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** List evaluations assigned to the current judge within a tenant */
  static async findByJudge(tenantId: string, judgeUserId: string) {
    return prisma.evaluation.findMany({
      where: {
        judgeId: judgeUserId,
        submission: { competition: { event: { organizationId: tenantId } } },
      },
      include: {
        submission: {
          select: {
            title: true,
            status: true,
            competition: { select: { name: true, event: { select: { name: true } } } },
            team: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Find one evaluation – enforces tenant scope */
  static async findById(tenantId: string, id: string) {
    return prisma.evaluation.findFirst({
      where: {
        id,
        submission: { competition: { event: { organizationId: tenantId } } },
      },
      include: {
        submission: {
          select: {
            title: true,
            status: true,
            payload: true,
            competition: { select: { name: true, event: { select: { name: true } } } },
            team: { select: { name: true } },
          },
        },
        judge: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  /** Assign a submission to a judge (create evaluation record) */
  static async create(tenantId: string, data: { submissionId: string; judgeId: string }) {
    // Verify submission belongs to tenant
    const sub = await prisma.submission.findFirst({
      where: { id: data.submissionId, competition: { event: { organizationId: tenantId } } },
    });
    if (!sub) throw new Error("Submission not found in this organization.");

    return prisma.evaluation.create({
      data: {
        submissionId: data.submissionId,
        judgeId: data.judgeId,
        status: EvaluationStatus.PENDING,
      },
    });
  }

  /** Update score / feedback / status — only the assigned judge OR an admin can do this */
  static async update(
    tenantId: string,
    id: string,
    data: Prisma.EvaluationUncheckedUpdateInput
  ) {
    const existing = await this.findById(tenantId, id);
    if (!existing) return null;
    return prisma.evaluation.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const existing = await this.findById(tenantId, id);
    if (!existing) return null;
    return prisma.evaluation.delete({ where: { id } });
  }
}
