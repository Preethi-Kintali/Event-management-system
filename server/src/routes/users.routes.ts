import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { updateUserSchema, updateUserStatusSchema, createPrivilegedUserSchema, createUserSchema } from "../validators/users.validator";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";
import { requireGlobalPermission, requireAnyPermission, requireAnyGlobalPermission } from "../middleware/rbac.middleware";

const router = Router();
router.use(requireAuth);

router.post(
  "/privileged",
  requireAnyPermission(["users.create_manager", "users.create_faculty_coordinator"]),
  validateRequest(createPrivilegedUserSchema),
  UserController.createPrivilegedUser
);

// Profile
router.get("/me", UserController.getMe);
router.patch("/me", validateRequest(updateUserSchema), UserController.updateMe);

// Global user management (Platform Admin)

router.get("/", requireGlobalPermission("users.read"), UserController.findAll);
router.post("/", requireGlobalPermission("users.manage"), validateRequest(createUserSchema), UserController.create);
router.get("/:id", requireGlobalPermission("users.read"), UserController.findById);
router.patch("/:id", requireGlobalPermission("users.manage"), validateRequest(updateUserSchema), UserController.update);
router.patch("/:id/status", requireAnyGlobalPermission(["users.manage", "users.update_student_coordinator", "users.update_participant"]), validateRequest(updateUserStatusSchema), UserController.updateStatus);
router.delete("/:id", requireGlobalPermission("users.manage"), UserController.delete);

export { router as userRoutes };
