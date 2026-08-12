import {
  SecurityEvent,
  SecurityAlert,
  Session,
  SecurityDashboardSummary,
  SecurityPolicy,
  ComplianceStatus,
} from "../types/security.types";
import { fetchApi } from "@/lib/api-client";

export const SecurityService = {
  async getDashboardSummary(tenantId: string): Promise<SecurityDashboardSummary> {
    return fetchApi(`/api/v1/security/dashboard`, {
      headers: { "x-organization-id": tenantId },
    });
  },

  async getEvents(tenantId: string): Promise<SecurityEvent[]> {
    return fetchApi(`/api/v1/security/events`, {
      headers: { "x-organization-id": tenantId },
    });
  },

  async getAlerts(tenantId: string): Promise<SecurityAlert[]> {
    // Phase 5 Foundation: Basic alerts implementation based on events
    // For now, return empty array as real alerts come later
    return [];
  },

  async getSessions(tenantId: string): Promise<Session[]> {
    return fetchApi(`/api/v1/security/sessions`, {
      headers: { "x-organization-id": tenantId },
    });
  },

  async revokeSession(tenantId: string, sessionId: string): Promise<void> {
    return fetchApi(`/api/v1/security/sessions/${sessionId}/revoke`, {
      method: "POST",
      headers: { "x-organization-id": tenantId },
    });
  },

  async revokeAllOtherSessions(tenantId: string): Promise<void> {
    return fetchApi(`/api/v1/security/sessions/revoke-others`, {
      method: "POST",
      headers: { "x-organization-id": tenantId },
    });
  },

  async getPolicy(tenantId: string): Promise<SecurityPolicy> {
    return fetchApi(`/api/v1/security/policy`, {
      headers: { "x-organization-id": tenantId },
    });
  },

  async updatePolicy(tenantId: string, data: Partial<SecurityPolicy>): Promise<SecurityPolicy> {
    return fetchApi(`/api/v1/security/policy`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "x-organization-id": tenantId },
    });
  },

  async getComplianceStatus(tenantId: string): Promise<ComplianceStatus> {
    // Basic hardcoded compliance for now until we build compliance backend
    return {
      gdprCompliant: true,
      dataRetentionDays: 365,
      cookieConsentRequired: true,
      userExportRequests: 0,
      pendingDeletions: 0,
    };
  },

  async setupMfa(tenantId: string): Promise<{ secret: string; otpauth: string }> {
    return fetchApi(`/api/v1/security/mfa/setup`, {
      method: "POST",
      headers: { "x-organization-id": tenantId },
    });
  },

  async verifySetupMfa(tenantId: string, code: string): Promise<{ recoveryCodes: string[] }> {
    return fetchApi(`/api/v1/security/mfa/verify-setup`, {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: { "x-organization-id": tenantId },
    });
  },

  async disableMfa(tenantId: string, userId?: string): Promise<void> {
    return fetchApi(`/api/v1/security/mfa/disable`, {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: { "x-organization-id": tenantId },
    });
  },
};
