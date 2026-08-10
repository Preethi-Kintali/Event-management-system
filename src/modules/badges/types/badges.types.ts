export type BadgeCategory =
  | "Participation"
  | "Achievement"
  | "Leadership"
  | "Innovation"
  | "Coding"
  | "Teamwork"
  | "Learning"
  | "Special";
export type BadgeLevel = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
export type BadgeStatus = "Active" | "Draft" | "Archived";
export type AchievementStatus = "In Progress" | "Completed" | "Locked";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  level: BadgeLevel;
  points: number;
  recipients: number;
  status: BadgeStatus;
  createdDate: string;
  icon?: string;
}

export interface Achievement {
  id: string;
  name: string;
  criteria: string;
  xp: number;
  recipients: number;
  progress: number;
  status: AchievementStatus;
}

export interface BadgeDashboardSummary {
  totalBadges: number;
  activeBadges: number;
  badgesAwarded: number;
  participantsWithBadges: number;
  popularBadge: string;
}
