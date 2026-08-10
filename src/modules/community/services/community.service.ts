import { Discussion, Group, Connection, CommunityDashboardSummary } from "../types/community.types";

export const CommunityService = {
  async getDashboardSummary(): Promise<CommunityDashboardSummary> {
    return {
      members: 14200,
      activeGroups: 48,
      discussions: 1250,
      posts: 8400,
      events: 24,
    };
  },

  async getDiscussions(): Promise<Discussion[]> {
    return [
      {
        id: "disc_1",
        title: "Looking for teammates: AI Hackathon",
        author: "Rahul Singh",
        category: "Competitions",
        replies: 14,
        views: 240,
        likes: 8,
        lastActivity: "10 mins ago",
        status: "Open",
      },
      {
        id: "disc_2",
        title: "Best resources for learning Rust?",
        author: "Elena Rodriguez",
        category: "Coding",
        replies: 32,
        views: 850,
        likes: 45,
        lastActivity: "2 hours ago",
        status: "Open",
      },
      {
        id: "disc_3",
        title: "Feedback on my startup pitch deck",
        author: "James Chen",
        category: "Startups",
        replies: 8,
        views: 120,
        likes: 12,
        lastActivity: "5 hours ago",
        status: "Open",
      },
      {
        id: "disc_4",
        title: "Resolved: API Rate Limiting Issue",
        author: "System Admin",
        category: "General",
        replies: 2,
        views: 450,
        likes: 0,
        lastActivity: "1 day ago",
        status: "Resolved",
      },
      {
        id: "disc_5",
        title: "Inappropriate behavior at live event",
        author: "Anonymous",
        category: "Events",
        replies: 4,
        views: 100,
        likes: 0,
        lastActivity: "2 days ago",
        status: "Locked",
      },
    ];
  },

  async getDiscussionById(id: string): Promise<Discussion | undefined> {
    const discussions = await this.getDiscussions();
    return discussions.find((d) => d.id === id) || discussions[0];
  },

  async getGroups(): Promise<Group[]> {
    return [
      {
        id: "grp_1",
        group: "AI/ML Enthusiasts",
        category: "AI & ML",
        members: 4200,
        activity: "Very High",
        createdDate: "2025-10-12",
        status: "Active",
      },
      {
        id: "grp_2",
        group: "React Developers",
        category: "Web Development",
        members: 3100,
        activity: "High",
        createdDate: "2025-11-05",
        status: "Active",
      },
      {
        id: "grp_3",
        group: "Student Founders",
        category: "Entrepreneurship",
        members: 1800,
        activity: "Medium",
        createdDate: "2026-01-20",
        status: "Active",
      },
      {
        id: "grp_4",
        group: "Open Source Contributors",
        category: "Open Source",
        members: 2400,
        activity: "High",
        createdDate: "2025-12-01",
        status: "Active",
      },
      {
        id: "grp_5",
        group: "Women in Tech India",
        category: "Women in Tech",
        members: 1500,
        activity: "Very High",
        createdDate: "2026-03-08",
        status: "Active",
      },
    ];
  },

  async getNetworkingRecommendations(): Promise<Connection[]> {
    return [
      {
        id: "conn_1",
        name: "Rhea Kapoor",
        role: "AI Researcher",
        sharedSkills: ["Python", "TensorFlow"],
        sharedEvents: ["Global AI Summit"],
        sharedInterests: ["Deep Learning"],
        mutualConnections: 12,
        matchScore: 98,
      },
      {
        id: "conn_2",
        name: "David Miller",
        role: "Full Stack Engineer",
        sharedSkills: ["React", "TypeScript"],
        sharedEvents: ["Hack the Campus"],
        sharedInterests: ["Open Source"],
        mutualConnections: 8,
        matchScore: 92,
      },
      {
        id: "conn_3",
        name: "Lina Fox",
        role: "Product Designer",
        sharedSkills: ["Figma"],
        sharedEvents: ["Design Challenge"],
        sharedInterests: ["UI/UX", "Accessibility"],
        mutualConnections: 4,
        matchScore: 85,
      },
      {
        id: "conn_4",
        name: "Omar Tariq",
        role: "Founder",
        sharedSkills: ["Leadership"],
        sharedEvents: ["Global AI Summit", "Hack the Campus"],
        sharedInterests: ["Startups", "Venture Capital"],
        mutualConnections: 15,
        matchScore: 88,
      },
    ];
  },
};
