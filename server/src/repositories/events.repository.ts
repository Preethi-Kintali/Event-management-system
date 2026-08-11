import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class EventRepository {
  static async findAll(tenantId: string) {
    return prisma.event.findMany({
      where: { organizationId: tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.event.findFirst({
      where: { id, organizationId: tenantId }
    });
  }

  static async create(tenantId: string, data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({
      data: {
        ...data,
        organizationId: tenantId
      }
    });
  }

  static async update(tenantId: string, id: string, data: Prisma.EventUncheckedUpdateInput) {
    // Ensuring the event belongs to the tenant
    const event = await this.findById(tenantId, id);
    if (!event) return null;

    return prisma.event.update({
      where: { id },
      data
    });
  }

  static async delete(tenantId: string, id: string) {
    const event = await this.findById(tenantId, id);
    if (!event) return null;

    return prisma.event.delete({
      where: { id }
    });
  }
}
