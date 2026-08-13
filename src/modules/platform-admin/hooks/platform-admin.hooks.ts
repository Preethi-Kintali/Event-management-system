import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { PlatformSummary, TimelineEvent, License, AuditLog } from "../types/platform-admin.types";

export function usePlatformAdminSummary() {
  return useQuery({
    queryKey: ["platform-admin", "summary"],
    queryFn: async () => {
      const res = await fetchApi("/platform-admin/summary");
      return res.data as PlatformSummary;
    },
  });
}

export function usePlatformTimeline() {
  return useQuery({
    queryKey: ["platform-admin", "timeline"],
    queryFn: async () => {
      const res = await fetchApi("/platform-admin/timeline");
      return res.data as TimelineEvent[];
    },
  });
}

export function usePlatformSubscriptions() {
  return useQuery({
    queryKey: ["platform-admin", "subscriptions"],
    queryFn: async () => {
      const res = await fetchApi("/platform-admin/subscriptions");
      return res.data as License[];
    },
  });
}

export function usePlatformAuditLogs() {
  return useQuery({
    queryKey: ["platform-admin", "audit-logs"],
    queryFn: async () => {
      const res = await fetchApi("/platform-admin/audit-logs");
      return res.data as AuditLog[];
    },
  });
}
