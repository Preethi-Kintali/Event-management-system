import { Router } from "express";
import { RecruitmentController } from "../controllers/recruitment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Jobs
router.get("/jobs", requirePermission("recruitment.read"), RecruitmentController.getJobs);
router.post("/jobs", requirePermission("recruitment.manage"), RecruitmentController.createJob);
router.get("/jobs/:id", requirePermission("recruitment.read"), RecruitmentController.getJobById);
router.patch("/jobs/:id", requirePermission("recruitment.manage"), RecruitmentController.updateJob);
router.delete("/jobs/:id", requirePermission("recruitment.manage"), RecruitmentController.deleteJob);

// Applications
router.get("/applications", requirePermission("recruitment.manage"), RecruitmentController.getApplications);
router.patch("/applications/:id/stage", requirePermission("recruitment.manage"), RecruitmentController.updateApplicationStage);

// Phase 4D: Candidates (mapped to Applications internally)
router.get("/dashboard", requirePermission("recruitment.read"), RecruitmentController.getDashboardStats);
router.get("/candidates", requirePermission("recruitment.read"), RecruitmentController.getCandidates);
router.post("/candidates", requirePermission("recruitment.manage"), RecruitmentController.createCandidate);

export default router;
