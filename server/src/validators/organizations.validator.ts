import { z } from "zod";
import { OrganizationStatus } from "@prisma/client";

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  status: z.nativeEnum(OrganizationStatus).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const addMemberSchema = z.object({
  email: z.string().email(),
  roleId: z.string().uuid(),
});

export const updateMemberSchema = z.object({
  roleId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
});
