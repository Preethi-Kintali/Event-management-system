import { Router } from "express";
import { TeamController } from "../controllers/teams.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createTeamSchema, updateTeamSchema } from "../validators/teams.validator";

const router = Router();
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("teams.read"), TeamController.findAll);
router.get("/:id", requirePermission("teams.read"), TeamController.findById);
router.post("/", requirePermission("teams.manage"), validateRequest(createTeamSchema), TeamController.create);
router.patch("/:id", requirePermission("teams.manage"), validateRequest(updateTeamSchema), TeamController.update);
router.delete("/:id", requirePermission("teams.manage"), TeamController.delete);

export { router as teamRoutes };
