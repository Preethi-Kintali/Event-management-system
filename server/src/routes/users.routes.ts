import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { updateUserSchema, updateUserStatusSchema } from "../validators/users.validator";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";

const router = Router();
router.use(requireAuth);

// Profile
router.get("/me", UserController.getMe);
router.patch("/me", validateRequest(updateUserSchema), UserController.updateMe);

// Global user management (Platform Admin)
const requireGlobalPermission = (action: string) => async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: req.user!.id, role: { permissions: { some: { permission: { action } } } } },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });
    if (!membership) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Global permission required.", details: [] } });
    }
    next();
  } catch (error) { next(error); }
};

router.get("/", requireGlobalPermission("users.read"), UserController.findAll);
router.get("/:id", requireGlobalPermission("users.read"), UserController.findById);
router.patch("/:id", requireGlobalPermission("users.manage"), validateRequest(updateUserSchema), UserController.update);
router.patch("/:id/status", requireGlobalPermission("users.manage"), validateRequest(updateUserStatusSchema), UserController.updateStatus);

export { router as userRoutes };
