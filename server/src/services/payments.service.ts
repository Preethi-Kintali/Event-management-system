import { PaymentsRepository } from "../repositories/payments.repository";
import { StripeService, stripe } from "./stripe.service";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

export class PaymentsService {
  static async getPlans() {
    return PaymentsRepository.getPlans();
  }

  static async getSubscription(organizationId: string) {
    const subscription = await PaymentsRepository.getSubscription(organizationId);
    const billingProfile = await PaymentsRepository.getBillingProfile(organizationId);
    return { subscription, billingProfile };
  }

  static async updateBillingProfile(organizationId: string, data: Prisma.OrganizationBillingProfileUpdateInput & Prisma.OrganizationBillingProfileCreateInput) {
    return PaymentsRepository.upsertBillingProfile(organizationId, data);
  }

  static async createCheckoutSession(
    organizationId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string,
    couponCode?: string
  ) {
    const plan = await PaymentsRepository.getPlans().then(plans => plans.find(p => p.id === planId));
    if (!plan || !plan.stripePriceId) {
      throw Object.assign(new Error("Invalid plan"), { status: 400, code: "INVALID_PLAN" });
    }

    let billingProfile = await PaymentsRepository.getBillingProfile(organizationId);
    let stripeCustomerId = billingProfile?.stripeCustomerId;

    // Create Stripe Customer if none exists
    if (!stripeCustomerId) {
      const customer = await StripeService.createCustomer(
        billingProfile?.email || `org_${organizationId}@example.com`,
        `Organization ${organizationId}`,
        { organizationId }
      );
      stripeCustomerId = customer.id;
      
      // Upsert billing profile
      await PaymentsRepository.upsertBillingProfile(organizationId, {
        stripeCustomerId,
        email: billingProfile?.email || `org_${organizationId}@example.com`,
      });
    }

      // Check and apply coupon if provided
      let stripeCouponId: string | undefined = undefined;
      if (couponCode) {
        const coupon = await PaymentsRepository.getCouponByCode(organizationId, couponCode);
        if (!coupon) {
          throw Object.assign(new Error("Invalid or expired coupon"), { status: 400, code: "INVALID_COUPON" });
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          throw Object.assign(new Error("Coupon usage limit reached"), { status: 400, code: "COUPON_EXHAUSTED" });
        }
        
        // Ensure Stripe has the coupon
        const stripeCoupon = await StripeService.getOrCreateCoupon(coupon.code, coupon.type, coupon.value);
        stripeCouponId = stripeCoupon.id;

        // Increment usage optimistically (will need compensation if session fails to complete, but simple for now)
        await PaymentsRepository.incrementCouponUsage(coupon.id, organizationId);
      }

      const session = await StripeService.createSubscriptionCheckout(
        stripeCustomerId,
        plan.stripePriceId,
        organizationId,
        successUrl,
        cancelUrl,
        stripeCouponId
      );
  
      return { url: session.url };
    }
  
    static async validateCoupon(organizationId: string, code: string) {
      const coupon = await PaymentsRepository.getCouponByCode(organizationId, code);
      if (!coupon) return { valid: false, reason: "Invalid or expired coupon" };
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { valid: false, reason: "Coupon usage limit reached" };
      if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) return { valid: false, reason: "Coupon expired" };
      return { valid: true, coupon };
    }
  
    static async refundPayment(organizationId: string, paymentId: string, amount?: number, reason?: string) {
      const payment = await PaymentsRepository.getPayment(paymentId, organizationId);
      if (!payment) {
        throw Object.assign(new Error("Payment not found"), { status: 404 });
      }
      if (payment.status !== "SUCCEEDED" && payment.status !== "PARTIALLY_REFUNDED") {
        throw Object.assign(new Error("Payment cannot be refunded"), { status: 400 });
      }
      if (!payment.providerPaymentId) {
        throw Object.assign(new Error("Payment missing provider reference"), { status: 400 });
      }
  
      // Create refund in Stripe
      const stripeRefund = await StripeService.createRefund(payment.providerPaymentId, amount ? Math.round(amount * 100) : undefined, reason);
      
      // The local db refund record will be handled by the charge.refunded webhook, 
      // but we can create a pending record if we want. For simplicity, we rely on the webhook sync as requested.
      return { success: true, refundId: stripeRefund.id };
    }
  
    static async exportPaymentsCSV(organizationId: string) {
      const payments = await PaymentsRepository.getPayments(organizationId);
      
      // Simple CSV stringifier
      const header = ["Payment ID", "Date", "Amount", "Currency", "Status", "Provider", "Description"];
      const rows = payments.map(p => [
        p.id,
        p.createdAt.toISOString(),
        p.amount.toFixed(2),
        p.currency,
        p.status,
        p.provider,
        `"${(p.description || "").replace(/"/g, '""')}"`
      ]);
  
      return [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    }

  static async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;
    
    try {
      event = StripeService.verifyWebhookSignature(payload, signature);
    } catch (err: any) {
      throw Object.assign(new Error(err.message), { status: 400, code: "INVALID_SIGNATURE" });
    }

    // Check if event already processed for idempotency
    const existingEvent = await PaymentsRepository.getWebhookEvent(event.id);
    if (existingEvent && existingEvent.status === "PROCESSED") {
      return { success: true, message: "Already processed" };
    }

    if (!existingEvent) {
      await PaymentsRepository.createWebhookEvent({
        provider: "STRIPE",
        providerEventId: event.id,
        eventType: event.type,
        status: "PENDING",
        payload: event as unknown as Prisma.InputJsonValue,
      });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.processCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case "invoice.paid":
          await this.processInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await this.processSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case "charge.refunded":
          await this.processChargeRefunded(event.data.object as Stripe.Charge);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      const dbEvent = await PaymentsRepository.getWebhookEvent(event.id);
      if (dbEvent) {
         await PaymentsRepository.markWebhookEventProcessed(dbEvent.id);
      }
    } catch (error: any) {
      const dbEvent = await PaymentsRepository.getWebhookEvent(event.id);
      if (dbEvent) {
         await PaymentsRepository.markWebhookEventFailed(dbEvent.id, error.message);
      }
      throw error;
    }

    return { success: true };
  }

  private static async processCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const organizationId = session.metadata?.organizationId;
    if (!organizationId) throw new Error("Missing organizationId in session metadata");

    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await this.processSubscriptionUpdated(subscription);
    }
  }

  private static async processSubscriptionUpdated(subscription: Stripe.Subscription) {
    let organizationId = subscription.metadata?.organizationId;
    
    if (!organizationId) {
       // try finding by customer
       const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
       const billingProfile = await PaymentsRepository.getBillingProfileByStripeCustomerId(customerId);
       if (billingProfile) {
         organizationId = billingProfile.organizationId;
       } else {
         throw new Error("Cannot map subscription to organizationId");
       }
    }

    const priceId = subscription.items.data[0]?.price.id;
    const plan = await PaymentsRepository.getPlanByStripePriceId(priceId);
    if (!plan) throw new Error(`Unknown price ID: ${priceId}`);

    const status = StripeService.mapStripeStatus(subscription.status);

    await PaymentsRepository.upsertSubscription(organizationId, {
      planId: plan.id,
      status,
      provider: "STRIPE",
      providerSubId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  private static async processInvoicePaid(invoice: Stripe.Invoice) {
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
    if (!customerId) return;
    
    const billingProfile = await PaymentsRepository.getBillingProfileByStripeCustomerId(customerId);
    if (!billingProfile) return;

    const organizationId = billingProfile.organizationId;
    
    // Create Payment
    const payment = await PaymentsRepository.createPayment(organizationId, {
      amount: invoice.amount_paid / 100, // Stripe uses cents
      currency: invoice.currency.toUpperCase(),
      status: "SUCCEEDED",
      provider: "STRIPE",
      providerPaymentId: typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent?.id || invoice.charge as string,
      description: `Invoice ${invoice.number}`,
    });

    // Create internal Invoice
    await PaymentsRepository.createInvoice(organizationId, payment.id, {
      invoiceNumber: invoice.number || `INV-${Date.now()}`,
      subtotal: invoice.subtotal / 100,
      taxAmount: (invoice.tax || 0) / 100,
      discountAmount: (invoice.total_discount_amounts?.reduce((sum, d) => sum + d.amount, 0) || 0) / 100,
      total: invoice.total / 100,
      currency: invoice.currency.toUpperCase(),
      status: "PAID",
      issuedAt: new Date(invoice.created * 1000),
      paidAt: new Date(),
      invoiceUrl: invoice.hosted_invoice_url || null,
    });
  }

  private static async processChargeRefunded(charge: Stripe.Charge) {
    const payment = await PaymentsRepository.getPaymentByProviderId(charge.payment_intent as string || charge.id);
    if (!payment) return;

    await PaymentsRepository.updatePayment(payment.id, payment.organizationId, {
      status: charge.refunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
    });

    // Determine refund reason
    const refund = charge.refunds?.data[0];

    await PaymentsRepository.createRefund(payment.organizationId, payment.id, {
      amount: charge.amount_refunded / 100,
      reason: refund?.reason || "Refunded by Stripe",
      status: "SUCCEEDED",
      providerRefundId: refund?.id,
    });
  }

  static async getPayments(organizationId: string) {
    return PaymentsRepository.getPayments(organizationId);
  }

  static async getInvoices(organizationId: string) {
    return PaymentsRepository.getInvoices(organizationId);
  }

  static async getDashboardStats(organizationId: string) {
    return PaymentsRepository.getDashboardStats(organizationId);
  }
}
