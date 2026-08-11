import { AttendanceRepository } from "../repositories/attendance.repository";
import { AttendanceMethod, AttendanceStatus, SessionStatus } from "@prisma/client";

export class AttendanceService {
  // Sessions
  static async getSessions(tenantId: string) {
    return AttendanceRepository.findAllSessions(tenantId);
  }

  static async getSession(tenantId: string, sessionId: string) {
    const session = await AttendanceRepository.findSessionById(tenantId, sessionId);
    if (!session) throw { status: 404, code: "NOT_FOUND", message: "Session not found." };
    return session;
  }

  static async createSession(
    tenantId: string,
    data: {
      eventId: string;
      name: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      status?: SessionStatus;
    }
  ) {
    return AttendanceRepository.createSession(tenantId, data);
  }

  static async updateSession(
    tenantId: string,
    sessionId: string,
    data: { status?: SessionStatus; name?: string }
  ) {
    const session = await AttendanceRepository.updateSession(tenantId, sessionId, data);
    if (!session) throw { status: 404, code: "NOT_FOUND", message: "Session not found." };
    return session;
  }

  // Records
  static async getRecords(tenantId: string) {
    return AttendanceRepository.findAllRecords(tenantId);
  }

  static async checkIn(
    tenantId: string,
    sessionId: string,
    userId: string,
    method?: AttendanceMethod,
    status?: AttendanceStatus
  ) {
    return AttendanceRepository.checkIn(tenantId, sessionId, userId, method, status);
  }

  static async checkOut(tenantId: string, sessionId: string, userId: string) {
    return AttendanceRepository.checkOut(tenantId, sessionId, userId);
  }

  // Dashboard
  static async getDashboardSummary(tenantId: string) {
    return AttendanceRepository.getDashboardSummary(tenantId);
  }
}
