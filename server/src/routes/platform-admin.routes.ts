import { Router } from "express";
import { PlatformAdminController } from "../controllers/platform-admin.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireGlobalPermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);

router.get("/summary", requireGlobalPermission("platform.read"), PlatformAdminController.getSummary);
router.get("/timeline", requireGlobalPermission("platform.read"), PlatformAdminController.getTimeline);
router.get("/subscriptions", requireGlobalPermission("platform.read"), PlatformAdminController.getSubscriptions);
router.get("/audit-logs", requireGlobalPermission("platform.read"), PlatformAdminController.getAuditLogs);

export default router;
