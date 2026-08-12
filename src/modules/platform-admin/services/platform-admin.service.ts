import {
  Organization,
  License,
  PlatformRole,
  AuditLog,
  SubscriptionPlan,
} from "../types/platform-admin.types";
import { organizations, roles, auditLogs, subscriptions } from "@/lib/mock-data";

export const PlatformAdminService = {

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


};
