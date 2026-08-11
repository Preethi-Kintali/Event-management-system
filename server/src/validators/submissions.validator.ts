import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

export const createSubmissionSchema = z.object({
  title: z.string().min(3),
  payload: z.record(z.unknown()).optional(),
  teamId: z.string().uuid(),
  competitionId: z.string().uuid(),
  status: z.nativeEnum(SubmissionStatus).optional(),
});

export const updateSubmissionSchema = createSubmissionSchema.partial();
