import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(3),
  competitionId: z.string().uuid(),
});

export const updateTeamSchema = createTeamSchema.partial();
