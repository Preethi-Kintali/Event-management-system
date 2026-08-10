import { Winner, PrizeDistribution, WinnerDashboardSummary } from "../types/winners.types";
import { competitions, teams } from "@/lib/mock-data";

export const WinnersService = {
  async getDashboardSummary(): Promise<WinnerDashboardSummary> {
    return {
      totalWinners: 142,
      activeCompetitions: 18,
      prizesDistributed: "$1.2M",
      certificatesIssued: 4850,
      pendingPrizes: 12,
    };
  },

  async getWinners(): Promise<Winner[]> {
    return [
      {
        id: "win_1",
        winner: "Rhea Kapoor",
        competition: "AI for Accessibility Track",
        position: "Winner",
        team: "Neural Nomads",
        prize: "$25,000",
        status: "Prize Distributed",
        announcementDate: "2026-08-01",
        score: 96.5,
      },
      {
        id: "win_2",
        winner: "Aditya Rao",
        competition: "Campus Robotics Sprint",
        position: "Runner-up",
        team: "Circuit Breakers",
        prize: "₹2,00,000",
        status: "Announced",
        announcementDate: "2026-08-05",
        score: 91.2,
      },
      {
        id: "win_3",
        winner: "Jonas Lind",
        competition: "Sustainable Airframe Concept",
        position: "Special Mention",
        team: "Airfoil Collective",
        prize: "Certificate",
        status: "Selected",
        announcementDate: null,
        score: 84.0,
      },
      {
        id: "win_4",
        winner: "Meera Subramanian",
        competition: "Impact Business Model Case",
        position: "Winner",
        team: "Case Cartel",
        prize: "$10,000",
        status: "Prize Pending",
        announcementDate: "2026-07-30",
        score: 94.8,
      },
      {
        id: "win_5",
        winner: "Ben Carter",
        competition: "Fintech Growth Simulation",
        position: "Finalist",
        team: "Ledger Ninjas",
        prize: "Swag Kit",
        status: "Prize Distributed",
        announcementDate: "2026-07-25",
        score: 88.5,
      },
    ];
  },

  async getWinnerById(id: string): Promise<Winner | undefined> {
    const winners = await this.getWinners();
    return winners.find((w) => w.id === id) || winners[0];
  },

  async getPrizes(): Promise<PrizeDistribution[]> {
    return [
      {
        id: "prz_1",
        winner: "Rhea Kapoor",
        competition: "AI for Accessibility Track",
        prize: "First Prize Cash",
        amount: "$25,000",
        status: "Distributed",
        distributionDate: "2026-08-05",
        reference: "TXN-88419A",
      },
      {
        id: "prz_2",
        winner: "Meera Subramanian",
        competition: "Impact Business Model Case",
        prize: "First Prize Cash",
        amount: "$10,000",
        status: "Pending",
        distributionDate: null,
        reference: null,
      },
      {
        id: "prz_3",
        winner: "Aditya Rao",
        competition: "Campus Robotics Sprint",
        prize: "Runner-up Grant",
        amount: "₹2,00,000",
        status: "Processing",
        distributionDate: null,
        reference: "TXN-PENDING-4",
      },
    ];
  },
};
