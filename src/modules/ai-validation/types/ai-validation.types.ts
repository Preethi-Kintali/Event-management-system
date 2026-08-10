export type ValidationStatus =
  "pending" | "processing" | "passed" | "flagged" | "failed" | "manual_review";

export interface AIValidationRecord {
  id: string;
  submissionId: string;
  title: string;
  team: string;
  competition: string;
  status: ValidationStatus;
  plagiarismScore: number;
  aiContentScore: number;
  duplicateScore: number;
  codeQuality: number;
  grammarScore: number;
  createdDate: string;
}

export interface ValidationSummary {
  totalSubmissions: number;
  validatedSubmissions: number;
  flaggedSubmissions: number;
  plagiarismFlags: number;
  aiContentFlags: number;
  duplicateFlags: number;
  codeQualityIssues: number;
}
