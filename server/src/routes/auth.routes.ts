import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { registerSchema, loginSchema, verifyMfaSchema } from "../validators/auth.validator";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validateRequest(registerSchema), AuthController.register);
router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post("/logout", requireAuth, (req, res) => {
  // Clear client-side token or session. We don't have a session table yet, so we just acknowledge logout.
  res.json({ success: true, message: "Logged out successfully" });
});
router.get("/me", requireAuth, AuthController.me);
router.post("/mfa/verify", validateRequest(verifyMfaSchema), AuthController.verifyMfa);

export { router as authRoutes };
