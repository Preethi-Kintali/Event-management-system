import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
  createSessionSchema,
  updateSessionSchema,
  checkInSchema,
  checkOutSchema,
  generateQrSchema,
  scanQrSchema,
} from "../validators/attendance.validator";

const router = Router();
router.use(requireAuth);
router.use(requireTenant);

// Dashboard summary
router.get("/summary", requirePermission("events.read"), AttendanceController.getDashboard);

// Sessions
router.get("/sessions", requirePermission("events.read"), AttendanceController.getSessions);
router.get("/sessions/:id", requirePermission("events.read"), AttendanceController.getSession);
router.post(
  "/sessions",
  requirePermission("events.create"),
  validateRequest(createSessionSchema),
  AttendanceController.createSession
);
router.patch(
  "/sessions/:id",
  requirePermission("events.update"),
  validateRequest(updateSessionSchema),
  AttendanceController.updateSession
);

// Records
router.get("/records", requirePermission("events.read"), AttendanceController.getRecords);

// Check-in / Check-out
router.post(
  "/checkin",
  requirePermission("events.read"), // any staff member can check someone in
  validateRequest(checkInSchema),
  AttendanceController.checkIn
);
router.post(
  "/checkout",
  requirePermission("events.read"),
  validateRequest(checkOutSchema),
  AttendanceController.checkOut
);

// QR Code
router.post(
  "/qr/generate",
  requirePermission("events.read"),
  validateRequest(generateQrSchema),
  AttendanceController.generateQr
);

// This endpoint is used by the attendee when they scan the QR code.
// No explicit permission is required to check *oneself* in, only an active session and a valid JWT token.
router.post(
  "/qr/checkin",
  validateRequest(scanQrSchema),
  AttendanceController.scanQr
);

export { router as attendanceRoutes };
