import { Router } from "express";
import { SponsorsController } from "../controllers/sponsors.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Sponsors
router.get("/dashboard", requirePermission("sponsors.read"), SponsorsController.getDashboardStats);
router.get("/", requirePermission("sponsors.read"), SponsorsController.getSponsors);
router.post("/", requirePermission("sponsors.manage"), SponsorsController.createSponsor);
router.get("/:id", requirePermission("sponsors.read"), SponsorsController.getSponsorById);
router.patch("/:id", requirePermission("sponsors.manage"), SponsorsController.updateSponsor);
router.delete("/:id", requirePermission("sponsors.manage"), SponsorsController.deleteSponsor);

// Sponsorships
router.get("/:id/sponsorships", requirePermission("sponsors.read"), SponsorsController.getSponsorships);
router.post("/:id/sponsorships", requirePermission("sponsors.manage"), SponsorsController.addSponsorship);

export default router;
