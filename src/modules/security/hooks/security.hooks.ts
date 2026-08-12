import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SecurityService } from "../services/security.service";
import { SecurityPolicy } from "../types/security.types";

export function useSecurityDashboard(tenantId: string) {
  return useQuery({
    queryKey: ["security", "dashboard", tenantId],
    queryFn: () => SecurityService.getDashboardSummary(tenantId),
    enabled: !!tenantId,
  });
}

export function useSecurityEvents(tenantId: string) {
  return useQuery({
    queryKey: ["security", "events", tenantId],
    queryFn: () => SecurityService.getEvents(tenantId),
    enabled: !!tenantId,
  });
}

export function useSecurityAlerts(tenantId: string) {
  return useQuery({
    queryKey: ["security", "alerts", tenantId],
    queryFn: () => SecurityService.getAlerts(tenantId),
    enabled: !!tenantId,
  });
}

export function useSecuritySessions(tenantId: string) {
  return useQuery({
    queryKey: ["security", "sessions", tenantId],
    queryFn: () => SecurityService.getSessions(tenantId),
    enabled: !!tenantId,
  });
}

export function useRevokeSession(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => SecurityService.revokeSession(tenantId, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions", tenantId] });
    },
  });
}

export function useRevokeAllOtherSessions(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SecurityService.revokeAllOtherSessions(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "sessions", tenantId] });
    },
  });
}

export function useSecurityPolicy(tenantId: string) {
  return useQuery({
    queryKey: ["security", "policy", tenantId],
    queryFn: () => SecurityService.getPolicy(tenantId),
    enabled: !!tenantId,
  });
}

export function useUpdateSecurityPolicy(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SecurityPolicy>) => SecurityService.updatePolicy(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "policy", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["security", "dashboard", tenantId] });
    },
  });
}

export function useComplianceStatus(tenantId: string) {
  return useQuery({
    queryKey: ["security", "compliance", tenantId],
    queryFn: () => SecurityService.getComplianceStatus(tenantId),
    enabled: !!tenantId,
  });
}

export function useSetupMfa(tenantId: string) {
  return useMutation({
    mutationFn: () => SecurityService.setupMfa(tenantId),
  });
}

export function useVerifySetupMfa(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => SecurityService.verifySetupMfa(tenantId, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "dashboard", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["security", "events", tenantId] });
    },
  });
}

export function useDisableMfa(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId?: string) => SecurityService.disableMfa(tenantId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security", "dashboard", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["security", "events", tenantId] });
    },
  });
}
