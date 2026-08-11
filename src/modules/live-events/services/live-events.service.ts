import {
  LiveEvent,
  LiveAnnouncement,
  LivePoll,
  LiveQuestion,
  LeaderboardEntry,
} from "../types/live-events.types";

export const LiveEventsService = {
  async getCurrentEvent(): Promise<LiveEvent> {
    return {
      id: "le_123",
      title: "Global Tech Innovation Summit 2026",
      status: "Live",
      startTime: "2026-08-10T10:00:00Z",
      endTime: "2026-08-10T18:00:00Z",
      viewers: 3450,
      likes: 12400,
      isStreaming: true,
      streamUrl: "https://stream.ascent.dev/live/123",
    };
  },

  async getAnnouncements(): Promise<LiveAnnouncement[]> {
    return [
      {
        id: "a1",
        message: "Welcome to the keynote! Post your questions in the Q&A tab.",
        timestamp: "10:05 AM",
        author: "Event Admin",
      },
      {
        id: "a2",
        message: "Next session starts in 15 minutes on Stage B.",
        timestamp: "11:30 AM",
        author: "System",
      },
      {
        id: "a3",
        message: "The hackathon submission deadline has been extended by 2 hours.",
        timestamp: "12:00 PM",
        author: "Event Organizer",
      },
    ];
  },

  async getActivePolls(): Promise<LivePoll[]> {
    return [
      {
        id: "p1",
        question: "Which topic are you most excited about today?",
        status: "Open",
        options: [
          { label: "AI & Machine Learning", votes: 450 },
          { label: "Web3 & Blockchain", votes: 210 },
          { label: "Sustainable Tech", votes: 380 },
        ],
      },
      {
        id: "p2",
        question: "How did you hear about this summit?",
        status: "Closed",
        options: [
          { label: "Email", votes: 800 },
          { label: "Social Media", votes: 1200 },
          { label: "Colleague", votes: 300 },
        ],
      },
    ];
  },

  async getQuestions(): Promise<LiveQuestion[]> {
    return [
      {
        id: "q1",
        author: "Sarah Jenkins",
        question: "Will the recording be available after the session?",
        upvotes: 145,
        isAnswered: true,
        timestamp: "10:15 AM",
      },
      {
        id: "q2",
        author: "Mike T.",
        question: "What stack are the presenters using for the demo?",
        upvotes: 89,
        isAnswered: false,
        timestamp: "10:22 AM",
      },
      {
        id: "q3",
        author: "Anonymous",
        question: "Can we get access to the slides?",
        upvotes: 56,
        isAnswered: false,
        timestamp: "10:30 AM",
      },
    ];
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return [
      { userId: "u1", name: "Alex Rivera", score: 1250, rank: 1 },
      { userId: "u2", name: "Jamie Lin", score: 1100, rank: 2 },
      { userId: "u3", name: "Taylor Smith", score: 950, rank: 3 },
      { userId: "u4", name: "Jordan Lee", score: 820, rank: 4 },
      { userId: "u5", name: "Casey Jones", score: 780, rank: 5 },
    ];
  },
};
