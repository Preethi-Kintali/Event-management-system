export type CertificateType = 
  | "PARTICIPATION"
  | "COMPLETION"
  | "WINNER"
  | "FINALIST"
  | "JUDGE"
  | "MENTOR"
  | "VOLUNTEER";

export type CertificateStatus = "ISSUED" | "REVOKED";

export interface CertificateUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface CertificateEvent {
  id: string;
  name: string;
}

export interface CertificateCompetition {
  id: string;
  name: string;
}

export interface Certificate {
  id: string;
  userId: string;
  organizationId: string;
  eventId: string;
  competitionId: string | null;
  certificateNumber: string;
  type: CertificateType;
  title: string;
  description: string | null;
  status: CertificateStatus;
  issuedAt: string;
  expiryDate: string | null;
  verificationCode: string;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
  
  user: CertificateUser;
  event: CertificateEvent;
  competition?: CertificateCompetition | null;
  organization?: { id: string; name: string };
}

export interface CreateCertificatePayload {
  userId: string;
  eventId: string;
  competitionId?: string;
  type: CertificateType;
  title: string;
  description?: string;
  expiryDate?: string;
}

export interface BulkIssueCertificatePayload {
  eventId: string;
  userIds: string[];
  type: CertificateType;
  title: string;
  description?: string;
}
