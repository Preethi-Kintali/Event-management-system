import { z } from "zod";

export const createJudgeSchema = z.object({
  userId: z.string().uuid(),
  expertise: z.string().optional(),
  bio: z.string().optional(),
});

export const updateJudgeSchema = z.object({
  expertise: z.string().optional(),
  bio: z.string().optional(),
});

export const assignCompetitionSchema = z.object({
  competitionId: z.string().uuid(),
});
