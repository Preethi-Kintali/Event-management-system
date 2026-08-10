export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export type AlertStatus = "Open" | "Investigating" | "Resolved";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  user: string;
  event: string;
  severity: Severity;
  ipAddress: string;
  device: string;
  status: "Success" | "Blocked" | "Failed";
}

export interface SecurityAlert {
  id: string;
  alert: string;
  severity: Severity;
  source: string;
  created: string;
  status: AlertStatus;
  assignedTo: string | "Unassigned";
}

export interface Session {
  id: string;
  user: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  status: "Active" | "Idle" | "Revoked";
}

export interface SecurityPolicy {
  mfaEnabled: boolean;
  mfaRequiredForAdmins: boolean;
  minPasswordLength: number;
  passwordExpiryDays: number;
  lockoutThreshold: number;
  ssoEnabled: boolean;
  ssoProvider: string;
}

export interface ComplianceStatus {
  gdprCompliant: boolean;
  dataRetentionDays: number;
  cookieConsentRequired: boolean;
  userExportRequests: number;
  pendingDeletions: number;
}

export interface SecurityDashboardSummary {
  securityScore: number;
  activeSessions: number;
  mfaAdoptionPct: number;
  failedLogins24h: number;
  suspiciousActivities: number;
  criticalAlerts: number;
}
