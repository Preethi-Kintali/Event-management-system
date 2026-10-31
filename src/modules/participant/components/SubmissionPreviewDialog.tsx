import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  FileText,
  Lock,
  Paperclip,
  Eye,
  Star,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-client";

interface SubmissionPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: any;
  submission: any;
  activeTeam: any;
  activeEvent: any;
  selectedProblemStatement: any;
  formatScheduleDate: (date: any) => string;
}

export const SubmissionPreviewDialog: React.FC<SubmissionPreviewDialogProps> = ({
  open,
  onClose,
  isLoading,
  error,
  submission,
  activeTeam,
  activeEvent,
  selectedProblemStatement,
  formatScheduleDate,
}) => {
  const getFileViewUrl = (fileUrl: string) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
    const base = getApiBaseUrl().replace(/\/api\/v1\/?$/, "");
    return `${base}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] w-[calc(100vw-24px)] max-h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-card shadow-2xl">
        {isLoading && !submission ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-medium">Loading submission details...</p>
          </div>
        ) : error && !submission ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground">Submission Not Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                The requested submission details could not be retrieved or access is unauthorized.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : submission ? (
          <>
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0 bg-muted/10">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {submission.team?.name || activeTeam?.name || "Team"}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground leading-tight mt-0.5">
                    Round {submission.roundNumber || submission.eventRound?.roundNumber || 1} —{" "}
                    {submission.eventRound?.name || submission.title || "Round Submission"}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 select-all">
                    Submission ID: {submission.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable Read-Only View */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Summary Grid */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {submission.event?.name ||
                        submission.competition?.event?.name ||
                        activeEvent?.name ||
                        "Event"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Team</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {submission.team?.name || activeTeam?.name || "Team"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Problem Statement Code</span>
                    <p className="font-mono font-bold text-primary mt-0.5">
                      {submission.problemStatement?.code || selectedProblemStatement?.code || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Problem Statement Name</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {submission.problemStatement?.title || selectedProblemStatement?.title || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Submission Status</span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Badge variant="default" className="bg-emerald-600 text-white text-[10px] gap-1 font-bold border-transparent">
                        <Lock className="h-3 w-3" /> 🟢 SUBMITTED & LOCKED
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Submitted Date / Time</span>
                    <p className="font-mono text-foreground font-medium mt-0.5">
                      {formatScheduleDate(submission.lockedAt || submission.createdAt)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Submitted By</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {submission.submittedBy
                        ? `${submission.submittedBy.firstName || ""} ${submission.submittedBy.lastName || ""}`.trim() ||
                          submission.submittedBy.email
                        : "Team Member"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Description */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> SUBMISSION DESCRIPTION
                </h4>
                <div className="p-3.5 rounded-lg border bg-card text-foreground text-xs leading-relaxed whitespace-pre-line">
                  {(() => {
                    const descText =
                      submission.description ||
                      (submission.payload &&
                        typeof submission.payload === "object" &&
                        ((submission.payload as any).description || (submission.payload as any).content)) ||
                      submission.content;
                    return descText && String(descText).trim()
                      ? String(descText).trim()
                      : "No project description provided for this submission.";
                  })()}
                </div>
              </div>

              {/* Uploaded Files Roster */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" /> UPLOADED FILES ({submission.files?.length || 0})
                  </span>
                </h4>

                {submission.files && submission.files.length > 0 ? (
                  <div className="divide-y border rounded-lg overflow-hidden bg-card">
                    {submission.files.map((file: any, idx: number) => (
                      <div key={file.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-foreground truncate">{file.fileName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {(file.fileSize / (1024 * 1024)).toFixed(2)} MB • {file.fileType}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] shrink-0 gap-1 font-medium hover:bg-primary/10"
                          onClick={() =>
                            window.open(
                              getFileViewUrl(file.fileUrl || `/uploads/${file.fileName}`),
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-card text-center text-xs text-muted-foreground italic">
                    No files uploaded for this submission.
                  </div>
                )}
              </div>

              {/* Evaluation Progress */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500" /> EVALUATION PROGRESS
                </h4>

                {submission.evaluations && submission.evaluations.length > 0 ? (
                  <div className="space-y-2">
                    {submission.evaluations.map((ev: any, idx: number) => (
                      <div key={ev.id || idx} className="p-3 rounded-lg border bg-card space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            Judge:{" "}
                            {ev.judge?.user
                              ? `${ev.judge.user.firstName || ""} ${ev.judge.user.lastName || ""}`.trim() ||
                                ev.judge.user.email
                              : ev.judge?.name || "Assigned Judge"}
                          </span>
                          <span className="font-mono text-sm font-bold text-primary">
                            {ev.score ?? "—"} Marks
                          </span>
                        </div>
                        {ev.feedback && (
                          <div className="text-muted-foreground border-t pt-2 space-y-0.5">
                            <span className="font-medium text-[10px] uppercase tracking-wider text-foreground">
                              Judge Feedback:
                            </span>
                            <p className="italic text-xs leading-relaxed">{ev.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg bg-card text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      Status: <strong className="text-amber-600">Pending Evaluation</strong>
                    </span>
                    <span className="text-[11px] font-mono">No score assigned yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer - Strictly Read-Only, Close only */}
            <div className="p-4 border-t border-border shrink-0 bg-muted/20 flex justify-end">
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
