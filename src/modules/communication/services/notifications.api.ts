import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface Notification {
  id: string;
  organizationId: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: "ANNOUNCEMENT" | "EVENT" | "REGISTRATION" | "TEAM" | "SUBMISSION" | "EVALUATION" | "CERTIFICATE" | "SYSTEM";
  isRead: boolean;
  readAt: string | null;
  link: string | null;
  createdAt: string;
}

export function useNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", { page, limit }],
    queryFn: async () => {
      const res = await fetchApi(`/notifications?page=${page}&limit=${limit}`);
      return res as { data: Notification[]; total: number; unreadCount: number; page: number; limit: number };
    },
    refetchInterval: 60000, // Poll every minute
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchApi(`/notifications/${id}/read`, {
        method: "PATCH",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetchApi(`/notifications/read-all`, {
        method: "POST",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/notifications/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
