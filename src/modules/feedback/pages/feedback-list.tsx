import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useFeedbackList } from "../hooks/feedback.api";
import { Badge } from "@/components/ui/badge";

type FeedbackRow = {
  id: string;
  participant: string;
  event: string;
  rating: number;
  sentiment: string;
  category: string;
  submittedDate: string;
  status: string;
};

const columns: Column<FeedbackRow>[] = [
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
  const { data: responses = [], isLoading } = useFeedbackList();

  const rows: FeedbackRow[] = responses.map((r: any) => ({
    id: r.id,
    participant: r.participant ? `${r.participant.firstName} ${r.participant.lastName}` : "Unknown",
    event: r.survey?.name || "Unknown",
    rating: r.rating || 0,
    sentiment: r.sentiment,
    category: "General", // Default fallback
    submittedDate: new Date(r.createdAt).toLocaleDateString(),
    status: "Pending", // Default fallback
  }));

  if (isLoading) {
    return <div className="p-8">Loading feedback...</div>;
  }

  return (
    <ListPageTemplate<FeedbackRow>
      title="Feedback Inbox"
      description="Review individual feedback submissions and respond."
      crumbs={[{ label: "Engagement" }, { label: "Feedback", to: "/feedback" }, { label: "Inbox" }]}
      columns={columns}
      rows={rows}
      searchKeys={["participant", "event"]}
      facet={{ label: "Sentiment", key: "sentiment", options: ["Positive", "Neutral", "Negative"] }}
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Mark Reviewed", onSelect: () => {} },
        { label: "Reply to User", onSelect: () => {} },
      ]}
    />
  );
}

