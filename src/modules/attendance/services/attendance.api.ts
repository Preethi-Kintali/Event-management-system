import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiSessionStatus = "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
export type ApiAttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type ApiAttendanceMethod = "QR" | "MANUAL" | "OTP";

export interface ApiAttendanceSummary {
  todaysAttendance: number;
  totalParticipants: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

export interface ApiAttendanceSession {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: ApiSessionStatus;
  createdAt: string;
  updatedAt: string;
  event?: { id: string; name: string };
  _count?: { records: number };
  records?: ApiAttendanceRecord[];
}

export interface ApiAttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  checkInTime: string;
  checkOutTime: string | null;
  method: ApiAttendanceMethod;
  status: ApiAttendanceStatus;
  user?: { id: string; firstName: string | null; lastName: string | null; email: string };
  session?: {
    id: string;
    name: string;
    event?: { id: string; name: string };
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: async () => {
      const res = await fetchApi("/attendance/summary");
      return res.data as ApiAttendanceSummary;
    },
  });
}

export function useAttendanceSessions() {
  return useQuery({
    queryKey: ["attendance", "sessions"],
    queryFn: async () => {
      const res = await fetchApi("/attendance/sessions");
      return res.data as ApiAttendanceSession[];
    },
  });
}

export function useAttendanceSession(id: string) {
  return useQuery({
    queryKey: ["attendance", "sessions", id],
    queryFn: async () => {
      const res = await fetchApi(`/attendance/sessions/${id}`);
      return res.data as ApiAttendanceSession;
    },
    enabled: !!id,
  });
}

export function useAttendanceRecords() {
  return useQuery({
    queryKey: ["attendance", "records"],
    queryFn: async () => {
      const res = await fetchApi("/attendance/records");
      return res.data as ApiAttendanceRecord[];
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateAttendanceSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      eventId: string;
      name: string;
      description?: string;
      startTime: string;
      endTime: string;
      status?: ApiSessionStatus;
    }) => {
      const res = await fetchApi("/attendance/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiAttendanceSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useUpdateAttendanceSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: ApiSessionStatus; name?: string }) => {
      const res = await fetchApi(`/attendance/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return res.data as ApiAttendanceSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      userId: string;
      method?: ApiAttendanceMethod;
      status?: ApiAttendanceStatus;
    }) => {
      const res = await fetchApi("/attendance/checkin", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data as ApiAttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      const res = await fetchApi("/attendance/checkout", {
        method: "POST",
        body: JSON.stringify({ sessionId, userId }),
      });
      return res.data as ApiAttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
