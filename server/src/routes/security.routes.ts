import { Router } from "express";
import { SecurityController } from "../controllers/security.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

// Dashboard & Events
router.get("/dashboard", requireAuth, requireTenant, requirePermission("security.read"), SecurityController.getDashboard);
router.get("/events", requireAuth, requireTenant, requirePermission("security.read"), SecurityController.getEvents);

// Policy
router.get("/policy", requireAuth, requireTenant, requirePermission("security.read"), SecurityController.getPolicy);
router.put("/policy", requireAuth, requireTenant, requirePermission("security.manage"), SecurityController.updatePolicy);

// Sessions
router.get("/sessions", requireAuth, requireTenant, requirePermission("security.read"), SecurityController.getSessions);
router.post("/sessions/revoke-others", requireAuth, requireTenant, requirePermission("security.read"), SecurityController.revokeAllOtherSessions);
router.post("/sessions/:id/revoke", requireAuth, requireTenant, requirePermission("security.manage"), SecurityController.revokeSession);

// MFA
router.post("/mfa/setup", requireAuth, requireTenant, SecurityController.setupMfa);
router.post("/mfa/verify-setup", requireAuth, requireTenant, SecurityController.verifySetupMfa);
router.post("/mfa/disable", requireAuth, requireTenant, SecurityController.disableMfa);

export default router;
