import { Router } from "express";
import { OrganizationController } from "../controllers/organizations.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission, requireGlobalPermission } from "../middleware/rbac.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { createOrganizationSchema, updateOrganizationSchema, addMemberSchema, updateMemberSchema } from "../validators/organizations.validator";

const router = Router();

// To hit these routes, the user must be authenticated.
router.use(requireAuth);

// GLOBAL ROUTES (Platform Admin)
// Note: We simulate a global permission check by running `requireTenant` without requiring x-organization-id
// wait, our `requireTenant` strictly requires `x-organization-id`.
// For global endpoints, we should use a different middleware or pass a bypass flag.
// A simpler way: just create a specific middleware for Platform Admins, but for now we'll rely on the existing RBAC structure.
// Actually, `organization.manage` might be a global permission or tenant permission.
// To keep it simple and strictly adherent to the prompt, we'll enforce the existing tenant + RBAC flow for operations on specific orgs.
// And for global org creation, we'll bypass tenantId and just check global permissions.
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../utils/prisma";

router.get("/", requireGlobalPermission("platform.read"), OrganizationController.findAll);
router.post("/", requireGlobalPermission("platform.manage"), validateRequest(createOrganizationSchema), OrganizationController.create);

// TENANT SPECIFIC ROUTES (Organization Admin)
// These require the user to send `x-organization-id` matching `:id`.
const injectTenantFromParam = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.headers["x-organization-id"] = req.params.id; // Inject so requireTenant works cleanly
  next();
};

router.use("/:id", injectTenantFromParam, requireTenant);
router.get("/:id", requirePermission("organization.read"), OrganizationController.findById);
router.patch("/:id", requirePermission("organization.manage"), validateRequest(updateOrganizationSchema), OrganizationController.update);
router.delete("/:id", requireGlobalPermission("platform.manage"), OrganizationController.delete);

// MEMBER ROUTES
router.get("/:id/members", requirePermission("organization.read"), OrganizationController.findMembers);
router.post("/:id/members", requirePermission("organization.manage"), validateRequest(addMemberSchema), OrganizationController.addMember);
router.patch("/:id/members/:memberId", requirePermission("organization.manage"), validateRequest(updateMemberSchema), OrganizationController.updateMember);
router.delete("/:id/members/:memberId", requirePermission("organization.manage"), OrganizationController.removeMember);

export { router as organizationRoutes };
