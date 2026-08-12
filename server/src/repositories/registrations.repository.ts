import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class RegistrationRepository {
  static async findAll(tenantId: string, filters?: { eventId?: string, search?: string, limit?: number }) {
    const where: Prisma.RegistrationWhereInput = {
      event: { organizationId: tenantId }
    };
    
    if (filters?.eventId) {
      where.eventId = filters.eventId;
    }

    if (filters?.search) {
      where.OR = [
        { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }

    return prisma.registration.findMany({
      where,
      include: { 
        event: { select: { name: true } },
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit ? Number(filters.limit) : 50
    });
  }

  static async findById(tenantId: string, id: string) {
    return prisma.registration.findFirst({
      where: { id, event: { organizationId: tenantId } },
      include: { 
        event: { select: { name: true } },
        user: { select: { firstName: true, lastName: true, email: true } }
      }
    });
  }

  static async create(tenantId: string, data: Prisma.RegistrationUncheckedCreateInput) {
    const event = await prisma.event.findFirst({ where: { id: data.eventId, organizationId: tenantId } });
    if (!event) throw new Error("Invalid event ID");

    return prisma.registration.create({ data });
  }

  static async update(tenantId: string, id: string, data: Prisma.RegistrationUncheckedUpdateInput) {
    const reg = await this.findById(tenantId, id);
    if (!reg) return null;

    if (data.eventId) {
      const event = await prisma.event.findFirst({ where: { id: data.eventId as string, organizationId: tenantId } });
      if (!event) throw new Error("Invalid event ID");
    }

    return prisma.registration.update({ where: { id }, data });
  }

  static async delete(tenantId: string, id: string) {
    const reg = await this.findById(tenantId, id);
    if (!reg) return null;
    return prisma.registration.delete({ where: { id } });
  }
}
