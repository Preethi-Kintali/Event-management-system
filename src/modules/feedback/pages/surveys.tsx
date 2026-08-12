import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useSurveys } from "../hooks/feedback.api";
import { Progress } from "@/components/ui/progress";

type SurveyRow = {
  id: string;
  name: string;
  event: string;
  audience: string;
  questions: number;
  responses: number;
  responseRate: number;
  status: string;
};

const columns: Column<SurveyRow>[] = [
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
      if (row.status === "PUBLISHED") statusId = "active";
      if (row.status === "DRAFT") statusId = "draft";
      if (row.status === "CLOSED") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function SurveysPage() {
  const { data: surveys = [], isLoading } = useSurveys();

  const rows: SurveyRow[] = surveys.map((s: any) => ({
    id: s.id,
    name: s.title,
    event: s.event ? s.event.name : "Global",
    audience: s.audience || "Everyone",
    questions: s._count?.questions || 0,
    responses: s._count?.responses || 0,
    responseRate: 0, // Default value
    status: s.status,
  }));

  if (isLoading) {
    return <div className="p-8">Loading surveys...</div>;
  }

  return (
    <ListPageTemplate<SurveyRow>
      title="Surveys"
      description="Manage feedback forms and data collection instruments."
      crumbs={[
        { label: "Engagement" },
        { label: "Feedback", to: "/feedback" },
        { label: "Surveys" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["name", "event", "audience"]}
      facet={{ label: "Status", key: "status", options: ["DRAFT", "PUBLISHED", "CLOSED"] }}
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

