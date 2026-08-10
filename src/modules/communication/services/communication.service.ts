import {
  Campaign,
  MessageLog,
  MessageTemplate,
  CommunicationSummary,
} from "../types/communication.types";
import { users } from "@/lib/mock-data";

export const CommunicationService = {
  async getDashboardSummary(): Promise<CommunicationSummary> {
    return {
      messagesSent: 42500,
      delivered: 41900,
      failed: 120,
      scheduled: 3400,
      openRate: 64.2,
      clickRate: 18.5,
    };
  },

  async getCampaigns(): Promise<Campaign[]> {
    return [
      {
        id: "cmpn_1",
        name: "Hackathon Registration Reminder",
        channel: "Email",
        audience: "All Participants",
        status: "Completed",
        sent: 12400,
        delivered: 12200,
        failed: 54,
        scheduledDate: "2026-08-10 09:00",
        createdBy: "Ananya Iyer",
      },
      {
        id: "cmpn_2",
        name: "Welcome to AI Summit",
        channel: "WhatsApp",
        audience: "Event Participants",
        status: "Sending",
        sent: 4820,
        delivered: 1200,
        failed: 2,
        scheduledDate: "2026-08-10 14:00",
        createdBy: "Marcus Feld",
      },
      {
        id: "cmpn_3",
        name: "Submission Deadline Warning",
        channel: "Push",
        audience: "Teams",
        status: "Scheduled",
        sent: 0,
        delivered: 0,
        failed: 0,
        scheduledDate: "2026-08-15 12:00",
        createdBy: "System",
      },
      {
        id: "cmpn_4",
        name: "Mentor Feedback Request",
        channel: "Email",
        audience: "Mentors",
        status: "Draft",
        sent: 0,
        delivered: 0,
        failed: 0,
        scheduledDate: null,
        createdBy: "Wei Chen",
      },
    ];
  },

  async getTemplates(): Promise<MessageTemplate[]> {
    return [
      {
        id: "tpl_1",
        name: "Registration Confirmation",
        channel: "Email",
        category: "Registration",
        lastUpdated: "2026-07-12",
        status: "Active",
      },
      {
        id: "tpl_2",
        name: "OTP Verification",
        channel: "SMS",
        category: "Security",
        lastUpdated: "2026-08-01",
        status: "Active",
      },
      {
        id: "tpl_3",
        name: "Event Schedule Update",
        channel: "WhatsApp",
        category: "Event",
        lastUpdated: "2026-08-05",
        status: "Draft",
      },
      {
        id: "tpl_4",
        name: "Submission Scored",
        channel: "In-App",
        category: "Evaluation",
        lastUpdated: "2026-06-22",
        status: "Active",
      },
    ];
  },

  async getMessageLogs(): Promise<MessageLog[]> {
    return users.map((u, i) => ({
      id: `log_${i}`,
      recipient: u.name,
      channel: ["Email", "SMS", "WhatsApp", "Push", "In-App"][i % 5] as any,
      campaign: "Hackathon Registration Reminder",
      sentAt: "2026-08-10 09:01",
      deliveredAt: i === 4 ? null : "2026-08-10 09:02",
      status: (i === 4 ? "Failed" : "Delivered") as any,
      failureReason: i === 4 ? "Invalid phone number" : null,
    }));
  },
};
