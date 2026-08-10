import {
  Organization,
  License,
  PlatformRole,
  AuditLog,
  SubscriptionPlan,
} from "../types/platform-admin.types";
import { organizations, roles, auditLogs, subscriptions } from "@/lib/mock-data";

export const PlatformAdminService = {
  async getOrganizations(): Promise<Organization[]> {
    return organizations as any; // Reusing existing mock data where applicable
  },

  async getRoles(): Promise<PlatformRole[]> {
    return roles as any;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return auditLogs as any;
  },

  async getLicenses(): Promise<License[]> {
    // Generate some mock licenses based on subscriptions
    return subscriptions.map((sub, i) => ({
      id: `lic_${i}`,
      org: sub.org,
      type: sub.plan,
      seats: sub.seats,
      usedSeats: sub.used,
      startDate: "2024-01-01",
      expiryDate: sub.renewal,
      status: sub.status as any,
    }));
  },

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [
      {
        id: "plan_1",
        name: "Free",
        price: 0,
        billingPeriod: "monthly",
        features: ["Up to 100 users", "Basic events"],
        activeSubscribers: 120,
        status: "active",
      },
      {
        id: "plan_2",
        name: "Starter",
        price: 49,
        billingPeriod: "monthly",
        features: ["Up to 500 users", "Advanced events", "Basic reporting"],
        activeSubscribers: 45,
        status: "active",
      },
      {
        id: "plan_3",
        name: "Growth",
        price: 199,
        billingPeriod: "monthly",
        features: ["Up to 5000 users", "Priority support", "Custom domains"],
        activeSubscribers: 18,
        status: "active",
      },
      {
        id: "plan_4",
        name: "Enterprise",
        price: 999,
        billingPeriod: "yearly",
        features: ["Unlimited users", "Dedicated success manager", "SLA"],
        activeSubscribers: 5,
        status: "active",
      },
    ];
  },
};
