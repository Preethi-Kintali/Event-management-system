export type DiscussionCategory =
  | "General"
  | "Events"
  | "Competitions"
  | "Coding"
  | "Innovation"
  | "Careers"
  | "Startups"
  | "Learning";
export type DiscussionStatus = "Open" | "Resolved" | "Locked";
export type GroupCategory =
  "AI & ML" | "Web Development" | "Entrepreneurship" | "Open Source" | "Women in Tech" | "Research";

export interface Discussion {
  id: string;
  title: string;
  author: string;
  category: DiscussionCategory;
  replies: number;
  views: number;
  likes: number;
  lastActivity: string;
  status: DiscussionStatus;
}

export interface Group {
  id: string;
  group: string;
  category: GroupCategory;
  members: number;
  activity: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

export interface Connection {
  id: string;
  name: string;
  role: string;
  sharedSkills: string[];
  sharedEvents: string[];
  sharedInterests: string[];
  mutualConnections: number;
  matchScore: number;
}

export interface CommunityDashboardSummary {
  members: number;
  activeGroups: number;
  discussions: number;
  posts: number;
  events: number;
}
