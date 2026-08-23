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
router.post("/chat", requirePermission("ai_copilot.use"), AICopilotController.chat);
router.post("/generate/event-description", requirePermission("ai_copilot.use"), AICopilotController.generateEventDescription);
router.post("/generate/event-rules", requirePermission("ai_copilot.use"), AICopilotController.generateEventRules);
router.post("/generate/evaluation-rubric", requirePermission("ai_copilot.use"), AICopilotController.generateEvaluationRubric);
router.post("/generate/email-template", requirePermission("ai_copilot.use"), AICopilotController.generateEmailTemplate);
router.post("/generate/insights-report", requirePermission("ai_copilot.use"), AICopilotController.generateInsightsReport);
router.get("/reports", requirePermission("ai_copilot.use"), AICopilotController.getInsightsReports);

export default router;
