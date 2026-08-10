import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { FeedbackService } from "../services/feedback.service";
import { Feedback } from "../types/feedback.types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const columns: Column<Feedback>[] = [
  {
    key: "participant",
    header: "Participant",
    sortable: true,
    render: (row) => <span className="font-medium">{row.participant}</span>,
  },
  { key: "event", header: "Event", sortable: true },
  {
    key: "rating",
    header: "Rating",
    sortable: true,
    render: (row) => <span className="tabular-nums">⭐ {row.rating}</span>,
  },
  {
    key: "sentiment",
    header: "Sentiment",
    sortable: true,
    render: (row) => {
      let color = "bg-muted text-muted-foreground";
      if (row.sentiment === "Positive")
        color = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      if (row.sentiment === "Negative") color = "bg-destructive/10 text-destructive";
      if (row.sentiment === "Neutral") color = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      return (
        <Badge variant="secondary" className={`shadow-none ${color}`}>
          {row.sentiment}
        </Badge>
      );
    },
  },
  { key: "category", header: "Category", sortable: true },
  {
    key: "submittedDate",
    header: "Date",
    sortable: true,
    render: (row) => <span className="text-xs text-muted-foreground">{row.submittedDate}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Reviewed") statusId = "published";
      if (row.status === "Pending") statusId = "draft";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function FeedbackListPage() {
  const [data, setData] = useState<Feedback[]>([]);

  useEffect(() => {
    FeedbackService.getFeedbackList().then(setData);
  }, []);

  return (
    <ListPageTemplate<Feedback>
      title="Feedback Inbox"
      description="Review individual feedback submissions and respond."
      crumbs={[{ label: "Engagement" }, { label: "Feedback", to: "/feedback" }, { label: "Inbox" }]}
      columns={columns}
      rows={data}
      searchKeys={["participant", "event", "comments"]}
      facet={{ label: "Sentiment", key: "sentiment", options: ["Positive", "Neutral", "Negative"] }}
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Mark Reviewed", onSelect: () => {} },
        { label: "Reply to User", onSelect: () => {} },
      ]}
    />
  );
}
