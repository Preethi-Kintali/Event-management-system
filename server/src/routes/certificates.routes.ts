import { Router } from "express";
import { CertificateController } from "../controllers/certificates.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createCertificateSchema, updateCertificateSchema, bulkIssueSchema } from "../validators/certificates.validator";

const router = Router();

// Public verify route
router.get("/verify/:code", CertificateController.verify);

// Protected routes
router.use(requireAuth);
router.use(requireTenant);

router.get("/", requirePermission("certificates.read"), CertificateController.getAll);
router.get("/:id", requirePermission("certificates.read"), CertificateController.getById);

router.post("/", requirePermission("certificates.create"), validateBody(createCertificateSchema), CertificateController.create);
router.patch("/:id", requirePermission("certificates.update"), validateBody(updateCertificateSchema), CertificateController.update);
router.delete("/:id", requirePermission("certificates.delete"), CertificateController.delete);

router.post("/bulk-issue", requirePermission("certificates.issue"), validateBody(bulkIssueSchema), CertificateController.bulkIssue);
router.post("/:id/revoke", requirePermission("certificates.revoke"), CertificateController.revoke);
router.get("/:id/download", requirePermission("certificates.read"), CertificateController.download);

export const certificatesRouter = router;
