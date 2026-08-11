import { z } from "zod";

export const createCompetitionSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  eventId: z.string().uuid(),
});

export const updateCompetitionSchema = createCompetitionSchema.partial();
