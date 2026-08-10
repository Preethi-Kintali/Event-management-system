export type Channel = "Email" | "SMS" | "WhatsApp" | "Push" | "In-App";
export type CampaignStatus = "Draft" | "Scheduled" | "Sending" | "Completed" | "Failed";
export type MessageStatus = "Queued" | "Sent" | "Delivered" | "Failed" | "Read";

export interface CommunicationSummary {
  messagesSent: number;
  delivered: number;
  failed: number;
  scheduled: number;
  openRate: number;
  clickRate: number;
}

export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  audience: string;
  status: CampaignStatus;
  sent: number;
  delivered: number;
  failed: number;
  scheduledDate: string | null;
  createdBy: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: Channel;
  category: string;
  lastUpdated: string;
  status: "Active" | "Draft" | "Archived";
}

export interface MessageLog {
  id: string;
  recipient: string;
  channel: Channel;
  campaign: string;
  sentAt: string | null;
  deliveredAt: string | null;
  status: MessageStatus;
  failureReason: string | null;
}
