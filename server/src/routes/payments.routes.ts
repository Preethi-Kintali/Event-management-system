import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireTenant } from "../middleware/tenant.middleware";
import { requirePermission } from "../middleware/rbac.middleware";
import express from "express";

const router = Router();

// ---------------------------------------------------------
// Webhook endpoint is mounted in app.ts before express.json()

// ---------------------------------------------------------
// Protected API endpoints
// ---------------------------------------------------------
router.use(requireAuth, requireTenant);

// Subscription Plans
router.get("/plans", requirePermission("payments.read"), PaymentsController.getPlans);

// Current Subscription & Billing
router.get("/subscription", requirePermission("payments.read"), PaymentsController.getSubscription);
router.put("/billing-profile", requirePermission("payments.manage"), PaymentsController.updateBillingProfile);

// Checkout
router.post("/checkout", requirePermission("payments.manage"), PaymentsController.createCheckoutSession);

// Transactions / Payments
router.get("/transactions", requirePermission("payments.read"), PaymentsController.getTransactions);
router.get("/export", requirePermission("payments.export"), PaymentsController.exportPayments);
router.post("/refund", requirePermission("payments.refund"), PaymentsController.refundPayment);

// Coupons
router.get("/coupons/validate", requirePermission("payments.manage"), PaymentsController.validateCoupon);

// Invoices
router.get("/invoices", requirePermission("payments.read"), PaymentsController.getInvoices);

// Dashboard stats
router.get("/dashboard", requirePermission("payments.read"), PaymentsController.getDashboard);

export default router;
