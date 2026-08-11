import { Router } from "express";
import { RoleController } from "../controllers/roles.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);

router.get("/", RoleController.getPermissions);

export { router as permissionRoutes };
