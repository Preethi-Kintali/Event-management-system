export type Status = "active" | "suspended" | "pending" | "archived" | "ACTIVE" | "SUSPENDED" | "INVITED";

export interface Organization {
  id: string;
  name: string;
  type: string;
  plan: string;
  members: number;
  events: number;
  status: Status;
  region: string;
  created: string;
}

export interface License {
  id: string;
  org: string;
  type: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  expiryDate: string;
  status: Status;
}

export interface PlatformRole {
  id: string;
  name: string;
  scope: string;
  users: number;
  permissions: number;
  description: string;
  status: Status;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  severity: "info" | "warning" | "error" | "critical";
  timestamp: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  activeSubscribers: number;
  status: Status;
}
