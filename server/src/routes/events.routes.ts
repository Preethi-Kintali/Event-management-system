import { Router } from "express";
import { EventController } from "../controllers/events.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createEventSchema, updateEventSchema } from "../validators/events.validator";

const router = Router();

// Apply auth and tenant resolution to all event routes
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("events.read"), EventController.findAll);
router.get("/:id", requirePermission("events.read"), EventController.findById);
router.get("/:id/dashboard", requirePermission("events.read"), EventController.getEventDashboard);
router.get("/:id/sessions", requirePermission("events.read"), EventController.getEventSessions);

router.post("/", requirePermission("events.create"), validateRequest(createEventSchema), EventController.create);

router.patch("/:id", requirePermission("events.update"), validateRequest(updateEventSchema), EventController.update);

router.delete("/:id", requirePermission("events.delete"), EventController.delete);

export { router as eventRoutes };
