import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserStatus } from "@prisma/client";

export class AuthService {
  static async register(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw { status: 400, code: "USER_EXISTS", message: "Email is already registered" };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        status: UserStatus.ACTIVE, // Auto-activate for dev
      }
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw { status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" };
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw { status: 403, code: "USER_INACTIVE", message: "Account is not active" };
    }

    const secret = process.env.JWT_SECRET || "replace-with-secure-secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "15m";
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });

    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
            role: { include: { permissions: { include: { permission: true } } } }
          }
        }
      }
    });

    if (!user) throw { status: 404, code: "USER_NOT_FOUND", message: "User not found" };

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
