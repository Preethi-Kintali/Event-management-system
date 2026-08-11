export interface LiveEvent {
  id: string;
  title: string;
  status: "Upcoming" | "Live" | "Ended";
  startTime: string;
  endTime: string;
  viewers: number;
  likes: number;
  isStreaming: boolean;
  streamUrl: string;
}

export interface LiveAnnouncement {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

export interface LivePoll {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  status: "Open" | "Closed";
}

export interface LiveQuestion {
  id: string;
  author: string;
  question: string;
  upvotes: number;
  isAnswered: boolean;
  timestamp: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank: number;
}
