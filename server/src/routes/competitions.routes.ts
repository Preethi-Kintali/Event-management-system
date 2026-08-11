import { Router } from "express";
import { CompetitionController } from "../controllers/competitions.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createCompetitionSchema, updateCompetitionSchema } from "../validators/competitions.validator";

const router = Router();
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("competitions.read"), CompetitionController.findAll);
router.get("/:id", requirePermission("competitions.read"), CompetitionController.findById);
router.post("/", requirePermission("competitions.manage"), validateRequest(createCompetitionSchema), CompetitionController.create);
router.patch("/:id", requirePermission("competitions.manage"), validateRequest(updateCompetitionSchema), CompetitionController.update);
router.delete("/:id", requirePermission("competitions.manage"), CompetitionController.delete);

export { router as competitionRoutes };
