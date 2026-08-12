import { Router } from "express";
import { IntegrationsController } from "../controllers/integrations.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("integrations.read"), IntegrationsController.getIntegrations);
router.get("/dashboard", requirePermission("integrations.read"), IntegrationsController.getDashboard);
router.get("/api-keys", requirePermission("integrations.read"), IntegrationsController.getApiKeys);
router.get("/webhooks", requirePermission("integrations.read"), IntegrationsController.getWebhooks);

export default router;
