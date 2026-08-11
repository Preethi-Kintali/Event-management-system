import { Router } from "express";
import { SubmissionController } from "../controllers/submissions.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createSubmissionSchema, updateSubmissionSchema } from "../validators/submissions.validator";

const router = Router();
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("submissions.read"), SubmissionController.findAll);
router.get("/:id", requirePermission("submissions.read"), SubmissionController.findById);
router.post("/", requirePermission("submissions.manage"), validateRequest(createSubmissionSchema), SubmissionController.create);
router.patch("/:id", requirePermission("submissions.manage"), validateRequest(updateSubmissionSchema), SubmissionController.update);
router.delete("/:id", requirePermission("submissions.manage"), SubmissionController.delete);

export { router as submissionRoutes };
