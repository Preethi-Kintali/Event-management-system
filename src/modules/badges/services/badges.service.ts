import { Badge, Achievement, BadgeDashboardSummary } from "../types/badges.types";

export const BadgesService = {
  async getDashboardSummary(): Promise<BadgeDashboardSummary> {
    return {
      totalBadges: 48,
      activeBadges: 42,
      badgesAwarded: 14250,
      participantsWithBadges: 8400,
      popularBadge: "Early Adopter",
    };
  },

  async getBadges(): Promise<Badge[]> {
    return [
      {
        id: "bdg_1",
        name: "Early Adopter",
        description: "Registered within 24 hours of event launch.",
        category: "Participation",
        level: "Bronze",
        points: 50,
        recipients: 4120,
        status: "Active",
        createdDate: "2026-01-15",
      },
      {
        id: "bdg_2",
        name: "Innovation Champion",
        description: "Top 5% score in innovation metrics.",
        category: "Innovation",
        level: "Gold",
        points: 500,
        recipients: 120,
        status: "Active",
        createdDate: "2026-03-22",
      },
      {
        id: "bdg_3",
        name: "Community Leader",
        description: "Organized a community side-event.",
        category: "Leadership",
        level: "Silver",
        points: 250,
        recipients: 84,
        status: "Active",
        createdDate: "2026-02-10",
      },
      {
        id: "bdg_4",
        name: "Bug Smasher",
        description: "Resolved 5+ critical issues during hackathon.",
        category: "Coding",
        level: "Platinum",
        points: 1000,
        recipients: 12,
        status: "Draft",
        createdDate: "2026-08-01",
      },
      {
        id: "bdg_5",
        name: "Team Player",
        description: "Rated 5 stars by all teammates.",
        category: "Teamwork",
        level: "Bronze",
        points: 100,
        recipients: 1450,
        status: "Archived",
        createdDate: "2025-11-05",
      },
    ];
  },

  async getBadgeById(id: string): Promise<Badge | undefined> {
    const badges = await this.getBadges();
    return badges.find((b) => b.id === id) || badges[0];
  },

  async getAchievements(): Promise<Achievement[]> {
    return [
      {
        id: "ach_1",
        name: "First Event",
        criteria: "Check-in to your first live event.",
        xp: 100,
        recipients: 8400,
        progress: 100,
        status: "Completed",
      },
      {
        id: "ach_2",
        name: "First Submission",
        criteria: "Submit your first project payload.",
        xp: 200,
        recipients: 6200,
        progress: 100,
        status: "Completed",
      },
      {
        id: "ach_3",
        name: "Top 10 Finalist",
        criteria: "Reach the top 10 in any competition.",
        xp: 1000,
        recipients: 450,
        progress: 80,
        status: "In Progress",
      },
      {
        id: "ach_4",
        name: "Mentor Excellence",
        criteria: "Maintain a 4.8+ rating over 50 mentoring hours.",
        xp: 5000,
        recipients: 18,
        progress: 42,
        status: "In Progress",
      },
      {
        id: "ach_5",
        name: "Grand Winner",
        criteria: "Secure 1st place in an Enterprise-tier competition.",
        xp: 10000,
        recipients: 5,
        progress: 0,
        status: "Locked",
      },
    ];
  },
};
