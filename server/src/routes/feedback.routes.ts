import { Router } from "express";
import { FeedbackController } from "../controllers/feedback.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Phase 4D Dashboard
router.get("/dashboard", requirePermission("feedback.read"), FeedbackController.getDashboardStats);

// Surveys
router.get("/surveys", requirePermission("feedback.read"), FeedbackController.getSurveys);
router.post("/surveys", requirePermission("feedback.manage"), FeedbackController.createSurvey);
router.get("/surveys/:id", requirePermission("feedback.read"), FeedbackController.getSurveyById);
router.patch("/surveys/:id", requirePermission("feedback.manage"), FeedbackController.updateSurvey);
router.delete("/surveys/:id", requirePermission("feedback.manage"), FeedbackController.deleteSurvey);

// Responses
router.get("/surveys/:id/responses", requirePermission("feedback.manage"), FeedbackController.getResponses);
router.post("/surveys/:id/responses", requirePermission("feedback.read"), FeedbackController.submitResponse);

// Feedback List (across all surveys)
router.get("/responses", requirePermission("feedback.manage"), FeedbackController.getFeedbackList);
router.get("/responses/:id", requirePermission("feedback.manage"), FeedbackController.getFeedbackById);

export default router;
