import { z } from "zod";

export const createVolunteerSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().optional(),
  bio: z.string().optional(),
});

export const updateVolunteerSchema = z.object({
  role: z.string().optional(),
  bio: z.string().optional(),
});

export const assignEventSchema = z.object({
  eventId: z.string().uuid(),
  shiftsCount: z.number().int().min(0).optional(),
  hoursCount: z.number().min(0).optional(),
});
