import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { LearningService } from "../services/learning.service";
import { Workshop } from "../types/learning.types";
import { useEffect, useState } from "react";

const columns: Column<Workshop>[] = [
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
      if (row.status === "Completed") statusId = "published";
      if (row.status === "Live") statusId = "active";
      if (row.status === "Upcoming") statusId = "draft";
      if (row.status === "Cancelled") statusId = "suspended";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export function WorkshopsPage() {
  const [data, setData] = useState<Workshop[]>([]);

  useEffect(() => {
    LearningService.getWorkshops().then(setData);
  }, []);

  return (
    <ListPageTemplate<Workshop>
      title="Live Workshops"
      description="Manage synchronous virtual and in-person sessions."
      crumbs={[
        { label: "Engagement" },
        { label: "Learning", to: "/learning" },
        { label: "Workshops" },
      ]}
      columns={columns}
      rows={data}
      searchKeys={["workshop", "instructor"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["Upcoming", "Live", "Completed", "Cancelled"],
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
