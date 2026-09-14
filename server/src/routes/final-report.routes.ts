import { Router } from "express";
import { FinalReportController } from "../controllers/final-report.controller";
import { requirePermission, requireAnyPermission } from "../middleware/rbac.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  requireAnyPermission(["events.read", "reports.read_assigned"]),
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
  "/finalize",
  requirePermission("reports.finalize_assigned"),
  FinalReportController.finalizeReport
);

router.get(
  "/pdf",
  requireAnyPermission(["events.read", "reports.read_assigned"]),
  FinalReportController.downloadPDF
);

export { router as finalReportRoutes };
