import { Router } from "express";
import { DeveloperController } from "../controllers/developer.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Enforce platform management access for all developer routes
router.use(requirePermission("platform.manage"));

router.get("/api", DeveloperController.getDashboardSummary);
router.get("/api/metrics", DeveloperController.getApiMetrics);
router.get("/api-keys", DeveloperController.getApiKeys);
router.post("/api-keys", DeveloperController.createApiKey);
router.post("/api-keys/:id/revoke", DeveloperController.revokeApiKey);

router.get("/queues", DeveloperController.getQueues);
router.get("/cron", DeveloperController.getCronJobs);
router.get("/logs", DeveloperController.getLogs);
router.get("/health", DeveloperController.getHealth);
router.get("/deployments", DeveloperController.getDeployments);

export default router;
