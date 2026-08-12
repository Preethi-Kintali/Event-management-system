import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { useFeedback } from "../hooks/feedback.api";
import { useRouterState } from "@tanstack/react-router";
import { User, MessageSquareQuote, History } from "lucide-react";
import { Timeline } from "@/components/ds/timeline";

export function FeedbackDetailsPage() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";
  const { data: record, isLoading } = useFeedback(id);

  if (isLoading) return <div className="p-8">Loading feedback details...</div>;
  if (!record) return <div className="p-8">Feedback not found.</div>;

  const participantName = (record as any).participant ? `${(record as any).participant.firstName} ${(record as any).participant.lastName}` : "Unknown";
  const eventName = (record as any).survey?.name || "Unknown";
  const submittedDate = new Date(record.createdAt).toLocaleString();
  const status: string = "Pending"; // Default fallback

  return (
    <DetailsPageTemplate
      title={`Feedback from ${participantName}`}
      description={eventName}
      crumbs={[
        { label: "Engagement" },
        { label: "Feedback", to: "/feedback" },
        { label: "Inbox", to: "/feedback/list" },
        { label: "Details" },
      ]}
      meta={
        <>
          <StatusChip status={status === "Reviewed" ? "published" : "draft"} />
          <span className="text-xs text-muted-foreground">General</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Reply to User</Button>
          <Button>Mark Reviewed</Button>
        </>
      }
      metrics={[
        { label: "Rating", value: `⭐ ${record.rating}` },
        { label: "Sentiment", value: record.sentiment || "Unknown" },
        { label: "Category", value: "General" },
        { label: "Submitted", value: submittedDate },
      ]}
      overview={
        <>
          <SectionCard title="Response Content" description="">
            <div className="flex gap-4 p-6 bg-muted/30 rounded-lg border border-border">
              <MessageSquareQuote className="w-8 h-8 text-primary/40 shrink-0" />
              <div className="flex-1">
                <p className="text-lg italic text-foreground mb-4">"{record.comments}"</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{participantName}</span>
                  <span className="text-xs text-muted-foreground"> • Participant profile</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Interaction History" description="">
            <div className="flex gap-4">
              <History className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <Timeline
                  items={[
                    {
                      id: "1",
                      title: "Feedback Submitted",
                      detail: "Via post-event survey link.",
                      time: submittedDate,
                      state: "done",
                    },
                    {
                      id: "2",
                      title: "Automated Sentiment Analysis",
                      detail: `Flagged as ${record.sentiment}.`,
                      time: submittedDate,
                      state: "done",
                    },
                    {
                      id: "3",
                      title: "Status: Reviewed",
                      detail: "Manually reviewed by admin.",
                      time: status === "Reviewed" ? "Yesterday" : "Pending",
                      state: status === "Reviewed" ? "done" : "current",
                    },
                  ]}
                />
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}

