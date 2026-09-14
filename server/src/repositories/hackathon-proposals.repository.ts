import { prisma } from "../utils/prisma";
import { Prisma, ProposalStatus } from "@prisma/client";

export class HackathonProposalRepository {
  static async create(tenantId: string, submittedById: string, data: any) {
    return prisma.hackathonProposal.create({
      data: {
        ...data,
        organizationId: tenantId,
        submittedById,
        status: ProposalStatus.DRAFT,
      },
    });
  }

  static async findAll(tenantId: string) {
    return prisma.hackathonProposal.findMany({
      where: { organizationId: tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        principal: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async findBySubmitter(tenantId: string, submittedById: string) {
    return prisma.hackathonProposal.findMany({
      where: { organizationId: tenantId, submittedById },
      orderBy: { createdAt: 'desc' },
      include: {
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        principal: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async findManagerProposals(tenantId: string, managerId: string) {
    return prisma.hackathonProposal.findMany({
      where: { 
        organizationId: tenantId,
        OR: [
          { status: ProposalStatus.SUBMITTED_TO_MANAGER },
          { managerId: managerId }
        ]
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async findPendingPrincipalReviews(tenantId: string) {
    return prisma.hackathonProposal.findMany({
      where: { 
        organizationId: tenantId,
        status: ProposalStatus.SUBMITTED_TO_PRINCIPAL
      },
      orderBy: { updatedAt: 'asc' },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.hackathonProposal.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        principal: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async update(tenantId: string, id: string, data: Prisma.HackathonProposalUpdateInput) {
    return prisma.hackathonProposal.update({
      where: { id },
      data,
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        principal: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async findApprovedProposals(tenantId: string) {
    return prisma.hackathonProposal.findMany({
      where: { 
        organizationId: tenantId,
        status: ProposalStatus.PRINCIPAL_APPROVED
      },
      orderBy: { updatedAt: 'asc' },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        principal: { select: { id: true, firstName: true, lastName: true, email: true } },
        event: true
      }
    });
  }

  static async delete(tenantId: string, id: string) {
    return prisma.hackathonProposal.delete({
      where: { id }
    });
  }
}
