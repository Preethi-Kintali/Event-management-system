import { Router } from "express";
import { HackathonProposalController } from "../controllers/hackathon-proposals.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission, requireAnyPermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { 
  createProposalSchema, 
  updateProposalSchema, 
  managerReviewSchema, 
  principalReviewSchema,
  createEventSchema
} from "../validators/hackathon-proposals.validator";

const router = Router();

// Apply auth and tenant resolution to all proposal routes
router.use(requireAuth);
router.use(requireTenant);

// Specific routes first to avoid catching by /:id
router.get("/", requirePermission("hackathon_proposals.read"), HackathonProposalController.getAll);
router.get("/my", requireAnyPermission(["hackathon_proposals.read", "hackathon_proposals.read_own"]), HackathonProposalController.getMyProposals);
router.get("/manager/pending", requirePermission("hackathon_proposals.review"), HackathonProposalController.getPendingManager);
router.get("/principal/pending", requirePermission("hackathon_proposals.principal_review"), HackathonProposalController.getPendingPrincipal);
router.get("/approved", requireAnyPermission(["hackathon_proposals.create_event", "hackathon_proposals.principal_review", "hackathon_proposals.review"]), HackathonProposalController.getApproved);

// Dynamic routes
router.get("/:id", requireAnyPermission(["hackathon_proposals.read", "hackathon_proposals.read_own"]), HackathonProposalController.getById);

router.post("/", requirePermission("hackathon_proposals.create"), validateRequest(createProposalSchema), HackathonProposalController.create);
router.patch("/:id", requireAnyPermission(["hackathon_proposals.update", "hackathon_proposals.update_own"]), validateRequest(updateProposalSchema), HackathonProposalController.update);

router.post("/:id/submit", requirePermission("hackathon_proposals.submit"), HackathonProposalController.submit);
router.delete("/:id", requireAnyPermission(["hackathon_proposals.delete", "hackathon_proposals.delete_own"]), HackathonProposalController.delete);
router.post("/:id/manager-review", requirePermission("hackathon_proposals.review"), validateRequest(managerReviewSchema), HackathonProposalController.managerReview);
router.post("/:id/principal-review", requirePermission("hackathon_proposals.principal_review"), validateRequest(principalReviewSchema), HackathonProposalController.principalReview);
router.post("/:id/create-event", requireAnyPermission(["hackathon_proposals.create_event", "hackathon_proposals.create_event_own"]), validateRequest(createEventSchema), HackathonProposalController.createEvent);

export { router as hackathonProposalRoutes };
