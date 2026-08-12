import { Router } from "express";
import { ReportsController } from "../controllers/reports.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Dashboard
router.get("/dashboard", requirePermission("reports.read"), ReportsController.getDashboardStats);

// JSON Lists
router.get("/events", requirePermission("reports.read"), ReportsController.getEventReports);
router.get("/competitions", requirePermission("reports.read"), ReportsController.getCompetitionReports);
router.get("/participants", requirePermission("reports.read"), ReportsController.getParticipantReports);
router.get("/evaluations", requirePermission("reports.read"), ReportsController.getEvaluationReports);
router.get("/attendance", requirePermission("reports.read"), ReportsController.getAttendanceReports);
router.get("/certificates", requirePermission("reports.read"), ReportsController.getCertificateReports);
router.get("/winners", requirePermission("reports.read"), ReportsController.getWinnerReports);
router.get("/communications", requirePermission("reports.read"), ReportsController.getCommunicationReports);

// CSV Exports
router.get("/events/export", requirePermission("reports.export"), ReportsController.exportEventReports);
router.get("/competitions/export", requirePermission("reports.export"), ReportsController.exportCompetitionReports);
router.get("/participants/export", requirePermission("reports.export"), ReportsController.exportParticipantReports);
router.get("/evaluations/export", requirePermission("reports.export"), ReportsController.exportEvaluationReports);
router.get("/attendance/export", requirePermission("reports.export"), ReportsController.exportAttendanceReports);
router.get("/certificates/export", requirePermission("reports.export"), ReportsController.exportCertificateReports);
router.get("/winners/export", requirePermission("reports.export"), ReportsController.exportWinnerReports);
router.get("/communications/export", requirePermission("reports.export"), ReportsController.exportCommunicationReports);

export default router;
