export type HealthStatus = "Healthy" | "Degraded" | "Down";
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface ApiMetric {
  id: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requests: number;
  avgResponseMs: number;
  errorRate: number;
  status: "Healthy" | "High Latency" | "Failing";
}

export interface Queue {
  id: string;
  name: string;
  pending: number;
  processing: number;
  failed: number;
  throughput: number; // msgs per second
  status: "Active" | "Paused" | "Backlog";
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  durationMs: number;
  status: "Enabled" | "Disabled";
  lastStatus: "Success" | "Failed";
}

export interface ApplicationLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  requestId: string;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: HealthStatus;
  uptime: number;
  responseTimeMs: number;
  lastCheck: string;
  version: string;
}

export interface Deployment {
  id: string;
  version: string;
  environment: "Production" | "Staging" | "Development";
  deployedBy: string;
  date: string;
  status: "Success" | "Failed" | "In Progress";
}

export interface SystemDashboardSummary {
  apiRequests24h: number;
  globalErrorRate: number;
  avgResponseTimeMs: number;
  queueSizeTotal: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
  storageUsagePct: number;
}
