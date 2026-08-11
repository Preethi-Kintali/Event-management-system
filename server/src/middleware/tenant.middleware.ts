import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { prisma } from "../utils/prisma";

export const requireTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const organizationId = req.headers["x-organization-id"] as string;

  if (!organizationId) {
    return res.status(400).json({
      success: false,
      error: { code: "MISSING_TENANT", message: "x-organization-id header is required.", details: [] }
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required before tenant resolution.", details: [] }
    });
  }

  try {
    // Verify the user actually belongs to this organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: req.user.id,
          organizationId: organizationId
        }
      }
    });

    if (!membership || membership.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You do not have access to this organization.", details: [] }
      });
    }

    req.tenantId = organizationId;
    next();
  } catch (error) {
    next(error);
  }
};
