import { z } from "zod";

export const createMentorSchema = z.object({
  userId: z.string().uuid(),
  expertise: z.string().optional(),
  bio: z.string().optional(),
});

export const updateMentorSchema = z.object({
  expertise: z.string().optional(),
  bio: z.string().optional(),
});

export const assignTeamSchema = z.object({
  teamId: z.string().uuid(),
});
