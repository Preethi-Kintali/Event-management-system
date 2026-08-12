import { prisma } from "../utils/prisma";
import { Prisma, SubscriptionStatus, PaymentStatus, InvoiceStatus, PaymentProvider } from "@prisma/client";

export class PaymentsRepository {
  // ---------------------------------------------------------
  // Plans
  // ---------------------------------------------------------
  static async getPlans() {
    return prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" }
    });
  }

  static async getPlanByStripePriceId(priceId: string) {
    return prisma.subscriptionPlan.findUnique({
      where: { stripePriceId: priceId }
    });
  }

  // ---------------------------------------------------------
  // Billing Profile
  // ---------------------------------------------------------
  static async getBillingProfile(organizationId: string) {
    return prisma.organizationBillingProfile.findUnique({
      where: { organizationId }
    });
  }

  static async upsertBillingProfile(organizationId: string, data: Prisma.OrganizationBillingProfileUpdateInput & Prisma.OrganizationBillingProfileCreateInput) {
    return prisma.organizationBillingProfile.upsert({
      where: { organizationId },
      update: data,
      create: {
        ...data,
        organization: { connect: { id: organizationId } }
      } as Prisma.OrganizationBillingProfileCreateInput
    });
  }

  static async getBillingProfileByStripeCustomerId(customerId: string) {
    return prisma.organizationBillingProfile.findUnique({
      where: { stripeCustomerId: customerId }
    });
  }

  // ---------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------
  static async getSubscription(organizationId: string) {
    return prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true }
    });
  }

  static async getSubscriptionByStripeId(providerSubId: string) {
    return prisma.subscription.findUnique({
      where: { providerSubId },
      include: { plan: true }
    });
  }

  static async upsertSubscription(
    organizationId: string,
    data: Omit<Prisma.SubscriptionCreateInput, "organization" | "plan"> & { planId: string }
  ) {
    return prisma.subscription.upsert({
      where: { organizationId },
      update: {
        ...data,
        plan: { connect: { id: data.planId } }
      },
      create: {
        ...data,
        organization: { connect: { id: organizationId } },
        plan: { connect: { id: data.planId } }
      }
    });
  }

  // ---------------------------------------------------------
  // Payment / Transaction
  // ---------------------------------------------------------
  static async createPayment(organizationId: string, data: Omit<Prisma.PaymentCreateInput, "organization">) {
    return prisma.payment.create({
      data: {
        ...data,
        organization: { connect: { id: organizationId } }
      }
    });
  }

  static async getPaymentByProviderId(providerPaymentId: string) {
    return prisma.payment.findUnique({
      where: { providerPaymentId }
    });
  }

  static async updatePayment(id: string, organizationId: string, data: Prisma.PaymentUpdateInput) {
    // Ensuring tenant isolation using a where clause on organizationId
    return prisma.payment.updateMany({
      where: { id, organizationId },
      data
    });
  }

  static async getPayments(organizationId: string) {
    return prisma.payment.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getPayment(id: string, organizationId: string) {
    return prisma.payment.findFirst({
      where: { id, organizationId }
    });
  }

  // ---------------------------------------------------------
  // Invoice
  // ---------------------------------------------------------
  static async createInvoice(organizationId: string, paymentId: string, data: Omit<Prisma.InvoiceCreateInput, "organization" | "payment">) {
    return prisma.invoice.create({
      data: {
        ...data,
        organization: { connect: { id: organizationId } },
        payment: { connect: { id: paymentId } }
      }
    });
  }

  static async getInvoices(organizationId: string) {
    return prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: { payment: true }
    });
  }

  static async getInvoice(id: string, organizationId: string) {
    return prisma.invoice.findFirst({
      where: { id, organizationId },
      include: { payment: true }
    });
  }

  // ---------------------------------------------------------
  // Coupon
  // ---------------------------------------------------------
  static async getCouponByCode(organizationId: string, code: string) {
    return prisma.coupon.findFirst({
      where: {
        organizationId,
        code,
        isActive: true,
      }
    });
  }

  static async incrementCouponUsage(id: string, organizationId: string) {
    return prisma.coupon.updateMany({
      where: { id, organizationId },
      data: {
        usedCount: { increment: 1 }
      }
    });
  }

  // ---------------------------------------------------------
  // Refund
  // ---------------------------------------------------------
  static async createRefund(organizationId: string, paymentId: string, data: Omit<Prisma.RefundCreateInput, "organization" | "payment">) {
    return prisma.refund.create({
      data: {
        ...data,
        organization: { connect: { id: organizationId } },
        payment: { connect: { id: paymentId } }
      }
    });
  }

  // ---------------------------------------------------------
  // Webhook Event
  // ---------------------------------------------------------
  static async getWebhookEvent(providerEventId: string) {
    return prisma.paymentWebhookEvent.findUnique({
      where: { providerEventId }
    });
  }

  static async createWebhookEvent(data: Prisma.PaymentWebhookEventCreateInput) {
    return prisma.paymentWebhookEvent.create({ data });
  }

  static async markWebhookEventProcessed(id: string) {
    return prisma.paymentWebhookEvent.update({
      where: { id },
      data: { status: "PROCESSED", processedAt: new Date() }
    });
  }

  static async markWebhookEventFailed(id: string, reason: string) {
    return prisma.paymentWebhookEvent.update({
      where: { id },
      data: { status: "FAILED", failureReason: reason }
    });
  }

  // ---------------------------------------------------------
  // Dashboard Aggregations
  // ---------------------------------------------------------
  static async getDashboardStats(organizationId: string) {
    const totalPayments = await prisma.payment.count({
      where: { organizationId, status: "SUCCEEDED" }
    });
    
    const revenueObj = await prisma.payment.aggregate({
      where: { organizationId, status: "SUCCEEDED" },
      _sum: { amount: true }
    });

    const pendingPayments = await prisma.payment.count({
      where: { organizationId, status: { in: ["PENDING", "PROCESSING"] } }
    });

    const failedPayments = await prisma.payment.count({
      where: { organizationId, status: "FAILED" }
    });

    const refunds = await prisma.refund.count({
      where: { organizationId, status: "SUCCEEDED" }
    });

    const outstandingInvoices = await prisma.invoice.count({
      where: { organizationId, status: { in: ["ISSUED", "DRAFT"] } }
    });

    return {
      totalSuccessfulPayments: totalPayments,
      pendingPayments,
      failedPayments,
      totalRevenue: revenueObj._sum.amount || 0,
      refunds,
      outstandingInvoices
    };
  }
}
