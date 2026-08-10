export type AttendanceMethod = "QR" | "OTP" | "GPS" | "Face Recognition" | "Manual";
export type AttendanceStatus = "Present" | "Late" | "Absent" | "Excused";

export interface AttendanceRecord {
  id: string;
  participant: string;
  event: string;
  session: string;
  checkInTime: string;
  checkOutTime: string | null;
  method: AttendanceMethod;
  status: AttendanceStatus;
}

export interface SessionAttendance {
  id: string;
  event: string;
  session: string;
  startTime: string;
  endTime: string;
  participants: number;
  present: number;
  attendanceRate: number;
  status: "Upcoming" | "Live" | "Completed";
}

export interface AttendanceSummary {
  todaysAttendance: number;
  totalParticipants: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}
