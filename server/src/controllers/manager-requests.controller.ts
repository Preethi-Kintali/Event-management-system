import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { MemberStatus } from "@prisma/client";

export class ManagerRequestsController {
  static async getRequests(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;

      // Find all PENDING memberships for this tenant that are for Faculty Coordinator role
      const requests = await prisma.organizationMember.findMany({
        where: {
          organizationId: tenantId,
          status: MemberStatus.PENDING,
          role: {
            name: "Faculty Coordinator"
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          role: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  }

  static async updateRequestStatus(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { memberId } = req.params;
      const { status } = req.body;

      if (!["ACTIVE", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Verify the membership exists, belongs to the tenant, and is PENDING
      const membership = await prisma.organizationMember.findFirst({
        where: {
          id: memberId,
          organizationId: tenantId,
          status: MemberStatus.PENDING
        }
      });

      if (!membership) {
        return res.status(404).json({ error: "Request not found or already processed" });
      }

      const updated = await prisma.organizationMember.update({
        where: { id: memberId },
        data: { status: status as MemberStatus }
      });

      res.json(updated);
    } catch (error) {
      console.error("Error updating request status:", error);
      res.status(500).json({ error: "Failed to update request status" });
    }
  }
}
