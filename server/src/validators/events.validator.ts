import { z } from "zod";
import { EventStatus } from "@prisma/client";

export const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.nativeEnum(EventStatus).optional(),
});

export const updateEventSchema = createEventSchema.omit({ status: true }).partial();

export const addEventTeamMemberSchema = z.object({
  userId: z.string().uuid(),
  responsibility: z.string().min(1).max(100),
});

export const updateEventTeamMemberSchema = z.object({
  responsibility: z.string().min(1).max(100),
});
