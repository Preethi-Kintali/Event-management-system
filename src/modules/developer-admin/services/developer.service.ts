import {
  ApiMetric,
  Queue,
  CronJob,
  ApplicationLog,
  ServiceHealth,
  Deployment,
  SystemDashboardSummary,
} from "../types/developer.types";

export const DeveloperService = {
  async getDashboardSummary(): Promise<SystemDashboardSummary> {
    return {
      apiRequests24h: 1250000,
      globalErrorRate: 0.12,
      avgResponseTimeMs: 145,
      queueSizeTotal: 450,
      cpuUsagePct: 42,
      memoryUsagePct: 65,
      storageUsagePct: 28,
    };
  },

  async getApiMetrics(): Promise<ApiMetric[]> {
    return [
      {
        endpoint: "/api/v1/users",
        method: "GET",
        requests: 450000,
        avgResponseMs: 120,
        errorRate: 0.05,
        status: "Healthy",
      },
      {
        endpoint: "/api/v1/registrations",
        method: "POST",
        requests: 12500,
        avgResponseMs: 340,
        errorRate: 0.1,
        status: "Healthy",
      },
      {
        endpoint: "/api/v1/submissions",
        method: "POST",
        requests: 8400,
        avgResponseMs: 1250,
        errorRate: 2.4,
        status: "High Latency",
      },
      {
        endpoint: "/api/v1/analytics/export",
        method: "GET",
        requests: 320,
        avgResponseMs: 5000,
        errorRate: 15.0,
        status: "Failing",
      },
      {
        endpoint: "/api/v1/events",
        method: "GET",
        requests: 890000,
        avgResponseMs: 45,
        errorRate: 0.01,
        status: "Healthy",
      },
    ];
  },

  async getQueues(): Promise<Queue[]> {
    return [
      {
        id: "q_1",
        name: "Email Delivery",
        pending: 12,
        processing: 5,
        failed: 0,
        throughput: 15,
        status: "Active",
      },
      {
        id: "q_2",
        name: "Push Notifications",
        pending: 0,
        processing: 0,
        failed: 0,
        throughput: 45,
        status: "Active",
      },
      {
        id: "q_3",
        name: "Certificate Generation",
        pending: 1450,
        processing: 10,
        failed: 45,
        throughput: 2,
        status: "Backlog",
      },
      {
        id: "q_4",
        name: "Report Aggregation",
        pending: 4,
        processing: 1,
        failed: 0,
        throughput: 0.5,
        status: "Active",
      },
      {
        id: "q_5",
        name: "Webhook Dispatch",
        pending: 125,
        processing: 0,
        failed: 12,
        throughput: 0,
        status: "Paused",
      },
    ];
  },

  async getCronJobs(): Promise<CronJob[]> {
    return [
      {
        id: "cron_1",
        name: "Daily Analytics Aggregation",
        schedule: "0 0 * * *",
        lastRun: "12 hours ago",
        nextRun: "12 hours from now",
        durationMs: 45000,
        status: "Enabled",
        lastStatus: "Success",
      },
      {
        id: "cron_2",
        name: "Session Cleanup",
        schedule: "*/15 * * * *",
        lastRun: "5 mins ago",
        nextRun: "10 mins from now",
        durationMs: 1200,
        status: "Enabled",
        lastStatus: "Success",
      },
      {
        id: "cron_3",
        name: "Subscription Expiry Check",
        schedule: "0 1 * * *",
        lastRun: "11 hours ago",
        nextRun: "13 hours from now",
        durationMs: 8500,
        status: "Enabled",
        lastStatus: "Success",
      },
      {
        id: "cron_4",
        name: "Legacy Database Sync",
        schedule: "0 */6 * * *",
        lastRun: "2 hours ago",
        nextRun: "4 hours from now",
        durationMs: 120000,
        status: "Disabled",
        lastStatus: "Failed",
      },
    ];
  },

  async getLogs(): Promise<ApplicationLog[]> {
    return [
      {
        id: "log_1",
        timestamp: "2026-08-10 12:45:11",
        level: "ERROR",
        service: "api-gateway",
        message: "Timeout connecting to downstream service: report-worker",
        requestId: "req_8f7d6a5",
      },
      {
        id: "log_2",
        timestamp: "2026-08-10 12:45:10",
        level: "WARN",
        service: "auth-service",
        message: "Rate limit threshold reached for IP 192.168.1.14",
        requestId: "req_2b4c9e1",
      },
      {
        id: "log_3",
        timestamp: "2026-08-10 12:45:05",
        level: "INFO",
        service: "email-worker",
        message: "Successfully dispatched 450 emails for campaign id=22",
        requestId: "req_none",
      },
      {
        id: "log_4",
        timestamp: "2026-08-10 12:44:59",
        level: "DEBUG",
        service: "db-pool",
        message: "Released connection 45 to pool",
        requestId: "req_none",
      },
      {
        id: "log_5",
        timestamp: "2026-08-10 12:44:12",
        level: "FATAL",
        service: "payment-service",
        message: "Failed to load Stripe secret key from environment",
        requestId: "req_init",
      },
    ];
  },

  async getHealth(): Promise<ServiceHealth[]> {
    return [
      {
        id: "svc_1",
        name: "Frontend App",
        status: "Healthy",
        uptime: 99.99,
        responseTimeMs: 45,
        lastCheck: "Just now",
        version: "v2.4.1",
      },
      {
        id: "svc_2",
        name: "Core API",
        status: "Healthy",
        uptime: 99.95,
        responseTimeMs: 120,
        lastCheck: "Just now",
        version: "v1.18.2",
      },
      {
        id: "svc_3",
        name: "PostgreSQL Database",
        status: "Healthy",
        uptime: 100,
        responseTimeMs: 12,
        lastCheck: "Just now",
        version: "15.4",
      },
      {
        id: "svc_4",
        name: "Redis Cache",
        status: "Healthy",
        uptime: 100,
        responseTimeMs: 2,
        lastCheck: "Just now",
        version: "7.0.11",
      },
      {
        id: "svc_5",
        name: "Background Workers",
        status: "Degraded",
        uptime: 98.5,
        responseTimeMs: 4500,
        lastCheck: "2 mins ago",
        version: "v1.18.2",
      },
      {
        id: "svc_6",
        name: "AI Integration Service",
        status: "Down",
        uptime: 94.2,
        responseTimeMs: 0,
        lastCheck: "5 mins ago",
        version: "v0.9.4",
      },
    ];
  },

  async getDeployments(): Promise<Deployment[]> {
    return [
      {
        id: "dep_1",
        version: "v2.4.1",
        environment: "Production",
        deployedBy: "CI/CD Pipeline",
        date: "2026-08-01 02:00:00",
        status: "Success",
      },
      {
        id: "dep_2",
        version: "v2.4.2-rc1",
        environment: "Staging",
        deployedBy: "johndoe",
        date: "2026-08-09 14:30:00",
        status: "Success",
      },
      {
        id: "dep_3",
        version: "v2.4.1",
        environment: "Production",
        deployedBy: "CI/CD Pipeline",
        date: "2026-07-30 02:00:00",
        status: "Failed",
      },
      {
        id: "dep_4",
        version: "v2.4.3-beta",
        environment: "Development",
        deployedBy: "saram",
        date: "2026-08-10 10:15:00",
        status: "In Progress",
      },
    ];
  },
};
