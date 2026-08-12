import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);
router.use(requirePermission("analytics.read"));

router.get("/participation", AnalyticsController.getParticipation);
router.get("/revenue", AnalyticsController.getRevenue);
router.get("/feedback", AnalyticsController.getFeedback);
router.get("/attendance", AnalyticsController.getAttendance);
router.get("/certificates", AnalyticsController.getCertificates);
router.get("/evaluations", AnalyticsController.getEvaluations);
router.get("/sponsors", AnalyticsController.getSponsors);
router.get("/recruitment", AnalyticsController.getRecruitment);
router.get("/ai", AnalyticsController.getAI);

export const analyticsRoutes = router;
