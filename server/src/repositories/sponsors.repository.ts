import { PrismaClient, Sponsor, Sponsorship } from "@prisma/client";

const prisma = new PrismaClient();

export class SponsorsRepository {
  // Sponsors
  static async findSponsors(organizationId: string) {
    return prisma.sponsor.findMany({
      where: { organizationId },
      include: {
        contacts: true,
        sponsorships: true,
        _count: { select: { sponsorships: true } },
      },
    });
  }

  static async findSponsorById(id: string, organizationId: string): Promise<Sponsor | null> {
    return prisma.sponsor.findUnique({
      where: { id, organizationId },
      include: {
        contacts: true,
        sponsorships: {
          include: { event: { select: { name: true } } }
        },
      },
    });
  }

  static async createSponsor(data: Omit<Sponsor, "id" | "createdAt" | "updatedAt">): Promise<Sponsor> {
    return prisma.sponsor.create({ data });
  }

  static async updateSponsor(id: string, organizationId: string, data: Partial<Sponsor>): Promise<Sponsor> {
    return prisma.sponsor.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteSponsor(id: string, organizationId: string): Promise<void> {
    await prisma.sponsor.delete({ where: { id, organizationId } });
  }

  // Sponsorships
  static async findSponsorships(sponsorId: string, organizationId: string): Promise<Sponsorship[]> {
    const sponsor = await prisma.sponsor.findUnique({ where: { id: sponsorId, organizationId } });
    if (!sponsor) return [];
    return prisma.sponsorship.findMany({
      where: { sponsorId },
      include: { event: { select: { name: true } } },
    });
  }

  static async createSponsorship(data: Omit<Sponsorship, "id" | "createdAt" | "updatedAt">): Promise<Sponsorship> {
    return prisma.sponsorship.create({ data });
  }
}
