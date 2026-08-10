export type Position = "Winner" | "Runner-up" | "Second Runner-up" | "Finalist" | "Special Mention";
export type WinnerStatus = "Selected" | "Announced" | "Prize Pending" | "Prize Distributed";
export type PrizeStatus = "Pending" | "Processing" | "Distributed" | "Failed";

export interface Winner {
  id: string;
  winner: string;
  competition: string;
  position: Position;
  team?: string;
  prize: string;
  status: WinnerStatus;
  announcementDate: string | null;
  score: number;
}

export interface PrizeDistribution {
  id: string;
  winner: string;
  competition: string;
  prize: string;
  amount: string;
  status: PrizeStatus;
  distributionDate: string | null;
  reference: string | null;
}

export interface WinnerDashboardSummary {
  totalWinners: number;
  activeCompetitions: number;
  prizesDistributed: string;
  certificatesIssued: number;
  pendingPrizes: number;
}
