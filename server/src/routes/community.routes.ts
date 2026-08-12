import { Router } from "express";
import { CommunityController } from "../controllers/community.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Phase 4D Dashboard
router.get("/dashboard", requirePermission("community.read"), CommunityController.getDashboardStats);

// Groups
router.get("/groups", requirePermission("community.read"), CommunityController.getGroups);
router.post("/groups", requirePermission("community.manage"), CommunityController.createGroup);
router.get("/groups/:id", requirePermission("community.read"), CommunityController.getGroupById);
router.patch("/groups/:id", requirePermission("community.manage"), CommunityController.updateGroup);
router.delete("/groups/:id", requirePermission("community.manage"), CommunityController.deleteGroup);

// Group Memberships
router.get("/groups/:id/members", requirePermission("community.read"), CommunityController.getMemberships);
router.post("/groups/:id/join", requirePermission("community.read"), CommunityController.joinGroup);
router.delete("/groups/:id/leave", requirePermission("community.read"), CommunityController.leaveGroup);

// Discussions
router.get("/discussions", requirePermission("community.read"), CommunityController.getDiscussions);
router.post("/discussions", requirePermission("community.read"), CommunityController.createDiscussion);
router.get("/discussions/:id", requirePermission("community.read"), CommunityController.getDiscussionById);
router.patch("/discussions/:id", requirePermission("community.manage"), CommunityController.updateDiscussion);
router.delete("/discussions/:id", requirePermission("community.manage"), CommunityController.deleteDiscussion);

// Discussion Replies
router.post("/discussions/:id/replies", requirePermission("community.read"), CommunityController.replyToDiscussion);

export default router;
