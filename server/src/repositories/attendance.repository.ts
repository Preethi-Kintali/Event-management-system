import { prisma } from "../utils/prisma";
import { AttendanceMethod, AttendanceStatus, SessionStatus } from "@prisma/client";

export class AttendanceRepository {
  // ─── Sessions ──────────────────────────────────────────────────────────────

  static async findAllSessions(tenantId: string) {
    return prisma.attendanceSession.findMany({
      where: { event: { organizationId: tenantId } },
      include: {
        event: { select: { id: true, name: true } },
        _count: { select: { records: true } },
      },
      orderBy: { startTime: "asc" },
    });
  }

  static async findSessionById(tenantId: string, sessionId: string) {
    return prisma.attendanceSession.findFirst({
      where: { id: sessionId, event: { organizationId: tenantId } },
      include: {
        event: { select: { id: true, name: true } },
        records: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
          orderBy: { checkInTime: "asc" },
        },
      },
    });
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
    // Verify event belongs to tenant
    const event = await prisma.event.findFirst({
      where: { id: data.eventId, organizationId: tenantId },
    });
    if (!event) throw new Error("Event not found in this organization.");
    return prisma.attendanceSession.create({ data });
  }

  static async updateSession(
    tenantId: string,
    sessionId: string,
    data: { status?: SessionStatus; name?: string }
  ) {
    const session = await this.findSessionById(tenantId, sessionId);
    if (!session) return null;
    return prisma.attendanceSession.update({ where: { id: sessionId }, data });
  }

  // ─── Records / Check-in ────────────────────────────────────────────────────

  static async findAllRecords(tenantId: string) {
    return prisma.attendanceRecord.findMany({
      where: { session: { event: { organizationId: tenantId } } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        session: {
          select: {
            id: true,
            name: true,
            event: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { checkInTime: "desc" },
    });
  }

  static async checkIn(
    tenantId: string,
    sessionId: string,
    userId: string,
    method: AttendanceMethod = AttendanceMethod.MANUAL,
    status: AttendanceStatus = AttendanceStatus.PRESENT
  ) {
    // Verify session is in this tenant
    const session = await prisma.attendanceSession.findFirst({
      where: { id: sessionId, event: { organizationId: tenantId } },
    });
    if (!session) throw new Error("Session not found in this organization.");

    return prisma.attendanceRecord.upsert({
      where: { sessionId_userId: { sessionId, userId } },
      create: { sessionId, userId, method, status, checkInTime: new Date() },
      update: { method, status, checkInTime: new Date() },
    });
  }

  static async checkOut(tenantId: string, sessionId: string, userId: string) {
    const session = await prisma.attendanceSession.findFirst({
      where: { id: sessionId, event: { organizationId: tenantId } },
    });
    if (!session) throw new Error("Session not found in this organization.");

    return prisma.attendanceRecord.update({
      where: { sessionId_userId: { sessionId, userId } },
      data: { checkOutTime: new Date() },
    });
  }

  // ─── Dashboard / Analytics ─────────────────────────────────────────────────

  static async getDashboardSummary(tenantId: string) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const [todayRecords, allRecords, lateSessions] = await Promise.all([
      prisma.attendanceRecord.count({
        where: {
          session: { event: { organizationId: tenantId } },
          checkInTime: { gte: startOfDay, lt: endOfDay },
        },
      }),
      prisma.attendanceRecord.findMany({
        where: { session: { event: { organizationId: tenantId } } },
        select: { status: true },
      }),
      prisma.attendanceRecord.count({
        where: {
          session: { event: { organizationId: tenantId } },
          status: AttendanceStatus.LATE,
        },
      }),
    ]);

    const present = allRecords.filter((r) => r.status === "PRESENT").length;
    const absent = allRecords.filter((r) => r.status === "ABSENT").length;
    const total = allRecords.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      todaysAttendance: todayRecords,
      totalParticipants: total,
      present,
      absent,
      late: lateSessions,
      attendanceRate,
    };
  }
}
