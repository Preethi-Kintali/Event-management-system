import { Router } from "express";
import { FinalReportController } from "../controllers/final-report.controller";
import { requirePermission, requireAnyPermission } from "../middleware/rbac.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  requireAnyPermission(["events.read", "reports.read_assigned", "events.read_assigned"]),
  FinalReportController.getFinalReport
);

router.post(
  "/draft",
  requirePermission("reports.update_assigned"),
  FinalReportController.saveDraft
);

router.post(
  "/generate",
  requirePermission("reports.update_assigned"),
  FinalReportController.generateAIDraft
);

router.post(
  "/submit-faculty",
  requirePermission("reports.update_assigned"),
  FinalReportController.submitToFaculty
);

router.post(
  "/faculty-review",
  requirePermission("events.update_assigned"),
  FinalReportController.facultyReview
);

router.post(
  "/manager-review",
  requireAnyPermission(["reports.read_assigned", "events.read"]), // Or a specific manager permission, but verifyManager checks role
  FinalReportController.managerReview
);

router.get(
  "/pdf",
  requireAnyPermission(["events.read", "reports.read_assigned", "events.read_assigned"]),
  FinalReportController.downloadPDF
);

export { router as finalReportRoutes };
