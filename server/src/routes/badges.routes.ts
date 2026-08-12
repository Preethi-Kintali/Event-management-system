import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { BadgesController } from "../controllers/badges.controller";

const router = Router();

// Apply global middleware
router.use(requireAuth);
router.use(requireTenant);

// Dashboard
router.get("/dashboard", requirePermission("badges.read"), BadgesController.getDashboard);

// Badges list and creation
router.get("/", requirePermission("badges.read"), BadgesController.getBadges);
router.post("/", requirePermission("badges.manage"), BadgesController.createBadge);

// Awards
router.post("/award", requirePermission("badges.award"), BadgesController.awardBadge);

// Achievements
router.get("/achievements", requirePermission("badges.read"), BadgesController.getAchievements);

// Individual Badge operations
router.get("/:id", requirePermission("badges.read"), BadgesController.getBadgeById);

export default router;
