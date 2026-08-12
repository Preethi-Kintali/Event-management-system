import { Router } from "express";
import { CommunicationController } from "../controllers/communications.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/dashboard", requirePermission("communications.read"), CommunicationController.getDashboard);
router.get("/", requirePermission("communications.read"), CommunicationController.findAll);
router.get("/:id", requirePermission("communications.read"), CommunicationController.findById);
router.post("/", requirePermission("communications.create"), CommunicationController.create);
router.patch("/:id", requirePermission("communications.update"), CommunicationController.update);
router.delete("/:id", requirePermission("communications.delete"), CommunicationController.delete);
router.post("/:id/publish", requirePermission("communications.publish"), CommunicationController.publish);
router.post("/:id/archive", requirePermission("communications.update"), CommunicationController.archive);

export default router;
