import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { Progress } from "@/components/ui/progress";
import { teams } from "@/lib/mock-data";

type Row = (typeof teams)[number];

const columns: Column<Row>[] = [
  {
    key: "name",
    header: "Team",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "competition", header: "Competition", sortable: true },
  { key: "lead", header: "Team lead", sortable: true },
  { key: "members", header: "Members", sortable: true },
  {
    key: "progress",
    header: "Progress",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Progress value={row.progress} className="h-1.5 w-20" />
        <span className="text-xs tabular-nums text-muted-foreground">{row.progress}%</span>
      </div>
    ),
  },
  { key: "submissions", header: "Submissions", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function TeamsListPage() {
  return (
    <ListPageTemplate<Row>
      title="Teams"
      description="Team formation, membership and progress across all competitions."
      crumbs={[{ label: "Programs" }, { label: "Teams" }]}
      columns={columns}
      rows={teams}
      searchKeys={["name", "competition", "lead"]}
      stats={[
        { label: "Teams", value: "3,120", delta: 9.8 },
        { label: "Avg team size", value: "3.8", hint: "members per team" },
        { label: "Complete profiles", value: "74%", progress: 74 },
        { label: "Inactive teams", value: "118", delta: -12.4 },
      ]}
      createLabel="Create team"
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
  );
}
