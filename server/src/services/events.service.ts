import { EventRepository } from "../repositories/events.repository";
import { Prisma } from "@prisma/client";

export class EventService {
  static async getEvents(tenantId: string) {
    return EventRepository.findAll(tenantId);
  }

  static async getEvent(tenantId: string, id: string) {
    const event = await EventRepository.findById(tenantId, id);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return event;
  }

  static async createEvent(tenantId: string, data: any) {
    return EventRepository.create(tenantId, data);
  }

  static async updateEvent(tenantId: string, id: string, data: any) {
    const event = await EventRepository.update(tenantId, id, data);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return event;
  }

  static async deleteEvent(tenantId: string, id: string) {
    const event = await EventRepository.delete(tenantId, id);
    if (!event) {
      throw { status: 404, code: "NOT_FOUND", message: "Event not found." };
    }
    return true;
  }
}
