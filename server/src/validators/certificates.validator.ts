import { z } from "zod";

export const createCertificateSchema = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  competitionId: z.string().uuid().optional(),
  type: z.enum(["PARTICIPATION", "COMPLETION", "WINNER", "FINALIST", "JUDGE", "MENTOR", "VOLUNTEER"]),
  title: z.string().min(3),
  description: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
});

export const updateCertificateSchema = createCertificateSchema.partial();

export const bulkIssueSchema = z.object({
  eventId: z.string().uuid(),
  userIds: z.array(z.string().uuid()).min(1),
  type: z.enum(["PARTICIPATION", "COMPLETION", "WINNER", "FINALIST", "JUDGE", "MENTOR", "VOLUNTEER"]),
  title: z.string().min(3),
  description: z.string().optional(),
});
