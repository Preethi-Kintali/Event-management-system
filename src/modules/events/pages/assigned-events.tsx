import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useAssignedEvents } from "../services/events.api";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

type AssignedEventRow = {
  id: string;
  name: string;
  status: string;
  date: string;
};

const columns: Column<AssignedEventRow>[] = [
  {
    key: "name",
    header: "Event Name",
    sortable: true,
    render: (row) => (
      <Link to="/events/$id" params={{ id: row.id }} className="font-medium hover:underline text-primary">
        {row.name}
      </Link>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status.toLowerCase() as any} />,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (row) => <span className="text-sm text-muted-foreground">{row.date}</span>,
  },
];

export function AssignedEventsPage() {
  const { data: events = [], isLoading } = useAssignedEvents();
  const navigate = useNavigate();

  const rows: AssignedEventRow[] = events.map((e) => ({
    id: e.id,
    name: e.name,
    status: e.status,
    date: new Date(e.startTime).toLocaleDateString(),
  }));

  if (isLoading) {
    return <div className="p-8">Loading assigned events...</div>;
  }

  return (
    <ListPageTemplate<AssignedEventRow>
      title="Assigned Events"
      description="Events you are responsible for executing and reporting on."
      crumbs={[
        { label: "Execution" },
        { label: "Assigned Events" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["name"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["LIVE", "COMPLETED", "PUBLISHED"],
      }}
      rowActions={[
        { label: "View Details", onSelect: (row) => navigate({ to: `/events/${row.id}` }) },
        { label: "Final Report", onSelect: (row) => navigate({ to: `/events/${row.id}/final-report` }) },
      ]}
    />
  );
}
