import { SponsorsRepository } from "../repositories/sponsors.repository";
import { AuditService } from "./audit.service";
import { Sponsor, Sponsorship } from "@prisma/client";

export class SponsorsService {
  static async getSponsors(organizationId: string): Promise<Sponsor[]> {
    return SponsorsRepository.findSponsors(organizationId);
  }

  static async getSponsorById(id: string, organizationId: string): Promise<Sponsor | null> {
    return SponsorsRepository.findSponsorById(id, organizationId);
  }

  static async createSponsor(data: any, organizationId: string, actorId: string): Promise<Sponsor> {
    const sponsor = await SponsorsRepository.createSponsor({
      ...data,
      organizationId,
    });
    await AuditService.log(organizationId, actorId, "SPONSOR_CREATE", sponsor.id);
    return sponsor;
  }

  static async updateSponsor(id: string, data: any, organizationId: string, actorId: string): Promise<Sponsor> {
    const sponsor = await SponsorsRepository.updateSponsor(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "SPONSOR_UPDATE", sponsor.id);
    return sponsor;
  }

  static async deleteSponsor(id: string, organizationId: string, actorId: string): Promise<void> {
    await SponsorsRepository.deleteSponsor(id, organizationId);
    await AuditService.log(organizationId, actorId, "SPONSOR_DELETE", id);
  }

  static async getSponsorships(sponsorId: string, organizationId: string): Promise<Sponsorship[]> {
    return SponsorsRepository.findSponsorships(sponsorId, organizationId);
  }

  static async addSponsorship(sponsorId: string, eventId: string, organizationId: string, actorId: string): Promise<Sponsorship> {
    const sponsor = await SponsorsRepository.findSponsorById(sponsorId, organizationId);
    if (!sponsor) throw { status: 404, code: "NOT_FOUND", message: "Sponsor not found" };

    const sponsorship = await SponsorsRepository.createSponsorship({
      sponsorId,
      eventId,
      deliverablesMet: 0,
    });
    await AuditService.log(organizationId, actorId, "SPONSORSHIP_CREATE", sponsorship.id);
    return sponsorship;
  }

  static async getDashboardStats(organizationId: string) {
    const sponsors = await SponsorsRepository.findSponsors(organizationId);
    let committedValue = 0;
    let deliverablesMet = 0;
    let deliverablesTarget = 0;
    let renewalsPending = 0;
    
    const now = new Date();
    const upcomingThreshold = new Date();
    upcomingThreshold.setDate(now.getDate() + 90); // 90 days for renewal

    sponsors.forEach(s => {
      committedValue += s.committedValue || 0;
      if (s.renewalDate && s.renewalDate > now && s.renewalDate <= upcomingThreshold) {
        renewalsPending++;
      }
      s.sponsorships.forEach((sp: any) => {
        deliverablesMet += sp.deliverablesMet || 0;
        deliverablesTarget += sp.deliverablesTarget || 0;
      });
    });

    const deliverablesMetPercent = deliverablesTarget > 0 ? Math.round((deliverablesMet / deliverablesTarget) * 100) : 0;

    return {
      sponsors: sponsors.length,
      committedValue,
      deliverablesMet: deliverablesMetPercent,
      renewalsPending,
    };
  }
}
