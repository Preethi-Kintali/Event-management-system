import { Router } from "express";
import { VolunteerController } from "../controllers/volunteers.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createVolunteerSchema, updateVolunteerSchema, assignEventSchema } from "../validators/volunteers.validator";

const router = Router();
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("events.read"), VolunteerController.findAll);
router.get("/:id", requirePermission("events.read"), VolunteerController.findById);
router.post("/", requirePermission("events.create"), validateRequest(createVolunteerSchema), VolunteerController.create);
router.patch("/:id", requirePermission("events.update"), validateRequest(updateVolunteerSchema), VolunteerController.update);
router.delete("/:id", requirePermission("events.delete"), VolunteerController.delete);

// Event assignment
router.post("/:id/events", requirePermission("events.update"), validateRequest(assignEventSchema), VolunteerController.assignEvent);
router.delete("/:id/events/:eventId", requirePermission("events.update"), VolunteerController.removeEvent);

export { router as volunteerRoutes };
