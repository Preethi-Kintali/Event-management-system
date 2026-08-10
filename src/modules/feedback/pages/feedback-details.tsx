import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { FeedbackService } from "../services/feedback.service";
import { Feedback } from "../types/feedback.types";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { User, MessageSquareQuote, History } from "lucide-react";
import { Timeline } from "@/components/ds/timeline";

export function FeedbackDetailsPage() {
  const [record, setRecord] = useState<Feedback | null>(null);
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  useEffect(() => {
    FeedbackService.getFeedbackById(id).then((r) => setRecord(r || null));
  }, [id]);

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={`Feedback from ${record.participant}`}
      description={record.event}
      crumbs={[
        { label: "Engagement" },
        { label: "Feedback", to: "/feedback" },
        { label: "Inbox", to: "/feedback/list" },
        { label: "Details" },
      ]}
      meta={
        <>
          <StatusChip status={record.status === "Reviewed" ? "published" : "draft"} />
          <span className="text-xs text-muted-foreground">{record.category}</span>
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
        { label: "Sentiment", value: record.sentiment },
        { label: "Category", value: record.category },
        { label: "Submitted", value: record.submittedDate },
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
                  <span className="text-sm font-medium">{record.participant}</span>
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
                      time: record.submittedDate,
                      state: "done",
                    },
                    {
                      id: "2",
                      title: "Automated Sentiment Analysis",
                      detail: `Flagged as ${record.sentiment}.`,
                      time: record.submittedDate,
                      state: "done",
                    },
                    {
                      id: "3",
                      title: "Status: Reviewed",
                      detail: "Manually reviewed by admin.",
                      time: record.status === "Reviewed" ? "Yesterday" : "Pending",
                      state: record.status === "Reviewed" ? "done" : "active",
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
