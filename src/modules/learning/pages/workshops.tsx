import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useWorkshops } from "../hooks/learning.api";

type WorkshopRow = {
  id: string;
  workshop: string;
  instructor: string;
  date: string;
  duration: string;
  participants: number;
  status: string;
};

const columns: Column<WorkshopRow>[] = [
  {
    key: "workshop",
    header: "Workshop",
    sortable: true,
    render: (row) => <span className="font-medium">{row.workshop}</span>,
  },
  { key: "instructor", header: "Host/Instructor", sortable: true },
  {
    key: "date",
    header: "Date & Time",
    sortable: true,
    render: (row) => <span className="text-sm">{row.date}</span>,
  },
  { key: "duration", header: "Duration", sortable: true },
  {
    key: "participants",
    header: "Registered",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.participants}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "COMPLETED") statusId = "published";
      if (row.status === "LIVE") statusId = "active";
      if (row.status === "UPCOMING") statusId = "draft";
      if (row.status === "CANCELLED") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function WorkshopsPage() {
  const { data: workshops = [], isLoading } = useWorkshops();

  const rows: WorkshopRow[] = workshops.map((w: any) => ({
    id: w.id,
    workshop: w.title,
    instructor: w.instructor ? `${w.instructor.firstName} ${w.instructor.lastName}` : "Unknown",
    date: new Date(w.date).toLocaleString(),
    duration: w.duration,
    participants: 0,
    status: w.status,
  }));

  if (isLoading) {
    return <div className="p-8">Loading workshops...</div>;
  }

  return (
    <ListPageTemplate<WorkshopRow>
      title="Live Workshops"
      description="Manage synchronous virtual and in-person sessions."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Workshops" },
      ]}
      columns={columns}
      rows={rows}
      searchKeys={["workshop", "instructor"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["UPCOMING", "LIVE", "COMPLETED", "CANCELLED"],
      }}
      createLabel="Schedule Workshop"
      rowActions={[
        { label: "View Details", onSelect: () => {} },
        { label: "Manage Attendees", onSelect: () => {} },
        { label: "Start Session", onSelect: () => {} },
      ]}
    />
  );
}

