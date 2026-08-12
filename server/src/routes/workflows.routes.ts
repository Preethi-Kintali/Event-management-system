import { Router } from "express";
import { WorkflowsController } from "../controllers/workflows.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("workflows.read"), WorkflowsController.getWorkflows);
router.get("/dashboard", requirePermission("workflows.read"), WorkflowsController.getDashboard);
router.get("/executions", requirePermission("workflows.read"), WorkflowsController.getExecutions);
router.get("/templates", requirePermission("workflows.read"), WorkflowsController.getTemplates);

export default router;
