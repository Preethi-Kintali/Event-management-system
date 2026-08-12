import { Router } from "express";
import { AICopilotController } from "../controllers/ai-copilot.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/summary", requirePermission("ai_copilot.use"), AICopilotController.getSummary);
router.get("/recent", requirePermission("ai_copilot.use"), AICopilotController.getRecentRequests);

export default router;
