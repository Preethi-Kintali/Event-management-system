import { Router } from "express";
import { NotificationController } from "../controllers/notifications.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("notifications.read"), NotificationController.findMy);
router.post("/read-all", requirePermission("notifications.read"), NotificationController.markAllAsRead);
router.patch("/:id/read", requirePermission("notifications.read"), NotificationController.markAsRead);
router.delete("/:id", requirePermission("notifications.read"), NotificationController.delete);

export default router;
