import { z } from "zod";
import { AttendanceMethod, AttendanceStatus, SessionStatus } from "@prisma/client";

export const createSessionSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.nativeEnum(SessionStatus).optional(),
});

export const updateSessionSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
});

export const checkInSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  method: z.nativeEnum(AttendanceMethod).optional(),
  status: z.nativeEnum(AttendanceStatus).optional(),
});

export const checkOutSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
});
