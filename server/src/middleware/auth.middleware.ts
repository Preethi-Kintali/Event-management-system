import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  tenantId?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing or invalid token.", details: [] }
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "replace-with-secure-secret";
    const decoded = jwt.verify(token, secret) as { id: string; email: string; sessionId?: string };
    
    if (decoded.sessionId) {
      const session = await prisma.userSession.findUnique({
        where: { id: decoded.sessionId }
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Session not found.", details: [] }
        });
      }

      if (session.revokedAt) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Session has been revoked.", details: [] }
        });
      }

      if (session.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Session has expired.", details: [] }
        });
      }

      // Optionally update lastActivityAt here (debounce or interval to avoid too many DB writes)
      // For now, we omit it to keep middleware fast
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Token has expired or is invalid.", details: [] }
    });
  }
};
