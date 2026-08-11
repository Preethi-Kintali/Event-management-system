import { z } from "zod";
import { RegistrationStatus } from "@prisma/client";

export const createRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.nativeEnum(RegistrationStatus).optional(),
});

export const updateRegistrationSchema = createRegistrationSchema.partial();
