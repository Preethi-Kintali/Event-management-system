import {
  SecurityEvent,
  SecurityAlert,
  Session,
  SecurityDashboardSummary,
  SecurityPolicy,
  ComplianceStatus,
} from "../types/security.types";

export const SecurityService = {
  async getDashboardSummary(): Promise<SecurityDashboardSummary> {
    return {
      securityScore: 84,
      activeSessions: 145,
      mfaAdoptionPct: 62.5,
      failedLogins24h: 34,
      suspiciousActivities: 2,
      criticalAlerts: 1,
    };
  },

  async getEvents(): Promise<SecurityEvent[]> {
    return [
      {
        id: "evt_1",
        timestamp: "2 mins ago",
        user: "admin@ascent.dev",
        event: "Admin Login",
        severity: "Info",
        ipAddress: "192.168.1.45",
        device: "MacBook Pro",
        status: "Success",
      },
      {
        id: "evt_2",
        timestamp: "15 mins ago",
        user: "system",
        event: "Multiple Failed Logins",
        severity: "High",
        ipAddress: "45.22.11.9",
        device: "Unknown",
        status: "Blocked",
      },
      {
        id: "evt_3",
        timestamp: "1 hour ago",
        user: "johndoe@example.com",
        event: "Password Reset Requested",
        severity: "Medium",
        ipAddress: "142.250.190.46",
        device: "iPhone",
        status: "Success",
      },
      {
        id: "evt_4",
        timestamp: "2 hours ago",
        user: "admin2@ascent.dev",
        event: "API Key Generated",
        severity: "Low",
        ipAddress: "192.168.1.12",
        device: "Windows PC",
        status: "Success",
      },
      {
        id: "evt_5",
        timestamp: "Yesterday",
        user: "unknown",
        event: "Unauthorized API Access Attempt",
        severity: "Critical",
        ipAddress: "185.15.58.22",
        device: "Linux Server",
        status: "Failed",
      },
    ];
  },

  async getAlerts(): Promise<SecurityAlert[]> {
    return [
      {
        id: "alt_1",
        alert: "Brute Force Attack Detected",
        severity: "Critical",
        source: "Auth Service",
        created: "15 mins ago",
        status: "Investigating",
        assignedTo: "SecOps Team",
      },
      {
        id: "alt_2",
        alert: "MFA Disabled by Admin",
        severity: "High",
        source: "Admin Panel",
        created: "2 hours ago",
        status: "Open",
        assignedTo: "Unassigned",
      },
      {
        id: "alt_3",
        alert: "Unusual Download Volume",
        severity: "Medium",
        source: "Data Export",
        created: "Yesterday",
        status: "Resolved",
        assignedTo: "Data Privacy Officer",
      },
    ];
  },

  async getSessions(): Promise<Session[]> {
    return [
      {
        id: "ses_1",
        user: "admin@ascent.dev",
        device: "MacBook Pro",
        browser: "Chrome 115",
        location: "San Francisco, US",
        ipAddress: "192.168.1.45",
        loginTime: "2 hours ago",
        lastActivity: "Just now",
        status: "Active",
      },
      {
        id: "ses_2",
        user: "johndoe@example.com",
        device: "iPhone 14",
        browser: "Safari Mobile",
        location: "London, UK",
        ipAddress: "82.12.33.4",
        loginTime: "Yesterday",
        lastActivity: "15 mins ago",
        status: "Idle",
      },
      {
        id: "ses_3",
        user: "marketing@ascent.dev",
        device: "Windows PC",
        browser: "Edge 114",
        location: "New York, US",
        ipAddress: "104.28.12.99",
        loginTime: "3 days ago",
        lastActivity: "2 days ago",
        status: "Revoked",
      },
    ];
  },

  async getPolicy(): Promise<SecurityPolicy> {
    return {
      mfaEnabled: true,
      mfaRequiredForAdmins: true,
      minPasswordLength: 12,
      passwordExpiryDays: 90,
      lockoutThreshold: 5,
      ssoEnabled: true,
      ssoProvider: "Okta",
    };
  },

  async getComplianceStatus(): Promise<ComplianceStatus> {
    return {
      gdprCompliant: true,
      dataRetentionDays: 365,
      cookieConsentRequired: true,
      userExportRequests: 12,
      pendingDeletions: 4,
    };
  },
};
