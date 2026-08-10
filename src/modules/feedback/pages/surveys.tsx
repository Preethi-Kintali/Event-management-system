import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { FeedbackService } from "../services/feedback.service";
import { Survey } from "../types/feedback.types";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const columns: Column<Survey>[] = [
  {
    key: "name",
    header: "Survey Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "event", header: "Target Event", sortable: true },
  { key: "audience", header: "Audience", sortable: true },
  {
    key: "questions",
    header: "Questions",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.questions}</span>,
  },
  {
    key: "responses",
    header: "Responses",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.responses}</span>,
  },
  {
    key: "responseRate",
    header: "Completion Rate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 w-24">
        <Progress value={row.responseRate} className="h-1.5" />
        <span className="text-xs">{row.responseRate}%</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "Published") statusId = "active";
      if (row.status === "Draft") statusId = "draft";
      if (row.status === "Closed") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function SurveysPage() {
  const [data, setData] = useState<Survey[]>([]);

  useEffect(() => {
    FeedbackService.getSurveys().then(setData);
  }, []);

  return (
    <ListPageTemplate<Survey>
      title="Surveys"
      description="Manage feedback forms and data collection instruments."
      crumbs={[
        { label: "Engagement" },
        { label: "Feedback", to: "/feedback" },
        { label: "Surveys" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["name", "event", "audience"]}
      facet={{ label: "Status", key: "status", options: ["Draft", "Published", "Closed"] }}
      createLabel="Create Survey"
      createTo="/feedback/surveys/new"
      rowActions={[
        { label: "View Results", onSelect: () => {} },
        { label: "Edit Builder", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
      ]}
    />
  );
}
