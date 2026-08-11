import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {
  static async findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, status: true, createdAt: true }
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, status: true, createdAt: true }
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, status: true, createdAt: true }
    });
  }
}
