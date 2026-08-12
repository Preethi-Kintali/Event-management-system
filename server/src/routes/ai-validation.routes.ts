import { Router } from "express";
import { AIValidationController } from "../controllers/ai-validation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/queue", requirePermission("ai_validation.read"), AIValidationController.getValidationQueue);
router.get("/summary", requirePermission("ai_validation.read"), AIValidationController.getSummary);

export default router;
