import { AttendanceRecord, SessionAttendance, AttendanceSummary } from "../types/attendance.types";
import { scheduleItems, registrations } from "@/lib/mock-data";

export const AttendanceService = {
  async getDashboardSummary(): Promise<AttendanceSummary> {
    return {
      todaysAttendance: 1420,
      totalParticipants: 2000,
      present: 1420,
      absent: 480,
      late: 100,
      attendanceRate: 71,
    };
  },

  async getRecords(): Promise<AttendanceRecord[]> {
    return registrations.map((reg, i) => ({
      id: `att_${i}`,
      participant: reg.participant,
      event: reg.event,
      session: scheduleItems[i % scheduleItems.length].title,
      checkInTime: "08:45 AM",
      checkOutTime: i % 3 === 0 ? "05:00 PM" : null,
      method: ["QR", "OTP", "Manual"][i % 3] as any,
      status: ["Present", "Present", "Late", "Absent", "Excused"][i % 5] as any,
    }));
  },

  async getSessions(): Promise<SessionAttendance[]> {
    return scheduleItems.map((s, i) => ({
      id: s.id,
      event: "Global AI Innovation Summit 2026",
      session: s.title,
      startTime: s.time.split(" – ")[0],
      endTime: s.time.split(" – ")[1] || "—",
      participants: 500 + i * 50,
      present: 400 + i * 40,
      attendanceRate: 80,
      status: ["Completed", "Live", "Upcoming"][i % 3] as any,
    }));
  },
};
