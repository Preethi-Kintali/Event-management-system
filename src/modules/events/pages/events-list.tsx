import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useEvents, useDeleteEvent, ApiEvent } from "../services/events.api";
import { EventDialog } from "../components/event-dialog";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  DRAFT: "draft",
  PUBLISHED: "published",
  LIVE: "active",
  COMPLETED: "closed",
  CANCELLED: "cancelled",
};

const columns: Column<ApiEvent>[] = [
  {
    key: "name",
    header: "Event",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={statusLabel[row.status] ?? row.status} />,
  },
  {
    key: "startTime",
    header: "Starts",
    sortable: true,
    render: (row) => <span>{new Date(row.startTime).toLocaleDateString()}</span>,
  },
  {
    key: "endTime",
    header: "Ends",
    sortable: true,
    render: (row) => <span>{new Date(row.endTime).toLocaleDateString()}</span>,
  },
];

export function EventsListPage() {
  const { data: events = [], isLoading } = useEvents();
  const deleteMutation = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);

  const handleEdit = (row: ApiEvent) => {
    setEditingEvent(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ApiEvent) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <>
      <ListPageTemplate<ApiEvent>
        title="Events"
        description="Every event across your organizations with lifecycle state."
        crumbs={[{ label: "Programs" }, { label: "Events" }]}
        columns={columns}
        rows={events}
        loading={isLoading}
        searchKeys={["name"]}
        stats={[
          { label: "Total events", value: String(events.length) },
          {
            label: "Published",
            value: String(events.filter((e) => e.status === "PUBLISHED" || e.status === "LIVE").length),
          },
          { label: "Draft", value: String(events.filter((e) => e.status === "DRAFT").length) },
          { label: "Completed", value: String(events.filter((e) => e.status === "COMPLETED").length) },
        ]}
        facet={{
          label: "Status",
          key: "status",
          options: ["DRAFT", "PUBLISHED", "LIVE", "COMPLETED", "CANCELLED"],
        }}
        createLabel="Create event"
        onCreate={() => {
          setEditingEvent(null);
          setDialogOpen(true);
        }}
        rowActions={[
          { label: "Edit", onSelect: (row) => handleEdit(row) },
          { label: "Delete", onSelect: (row) => handleDelete(row) },
        ]}
      />
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
      />
    </>
  );
}
