import { z } from "zod";
import { EvaluationStatus } from "@prisma/client";

export const createEvaluationSchema = z.object({
  submissionId: z.string().uuid(),
  judgeId: z.string().uuid(),
});

export const updateEvaluationSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().optional(),
  status: z.nativeEnum(EvaluationStatus).optional(),
});
