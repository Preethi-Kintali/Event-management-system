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

router.post("/api-keys", requirePermission("integrations.manage"), IntegrationsController.createApiKey);
router.post("/api-keys/:id/revoke", requirePermission("integrations.manage"), IntegrationsController.revokeApiKey);

router.post("/webhooks", requirePermission("integrations.manage"), IntegrationsController.createWebhook);
router.put("/webhooks/:id", requirePermission("integrations.manage"), IntegrationsController.updateWebhook);
router.delete("/webhooks/:id", requirePermission("integrations.manage"), IntegrationsController.deleteWebhook);
router.get("/webhooks/:id/deliveries", requirePermission("integrations.read"), IntegrationsController.getWebhookDeliveries);
router.post("/webhooks/:id/ping", requirePermission("integrations.manage"), IntegrationsController.pingWebhook);

export default router;
