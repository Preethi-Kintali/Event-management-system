import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { updateUserSchema, updateUserStatusSchema } from "../validators/users.validator";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";
import { requireGlobalPermission } from "../middleware/rbac.middleware";

const router = Router();
router.use(requireAuth);

// Profile
router.get("/me", UserController.getMe);
router.patch("/me", validateRequest(updateUserSchema), UserController.updateMe);

// Global user management (Platform Admin)

router.get("/", requireGlobalPermission("users.read"), UserController.findAll);
router.get("/:id", requireGlobalPermission("users.read"), UserController.findById);
router.patch("/:id", requireGlobalPermission("users.manage"), validateRequest(updateUserSchema), UserController.update);
router.patch("/:id/status", requireGlobalPermission("users.manage"), validateRequest(updateUserStatusSchema), UserController.updateStatus);

export { router as userRoutes };
