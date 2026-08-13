import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useManagerEvents, useDeleteManagerEvent } from "../hooks/manager.api";
import { ApiEvent } from "@/modules/events/services/events.api";
import { ManagerEventDialog } from "../components/manager-event-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  DRAFT: "draft",
  PUBLISHED: "published",
  LIVE: "active",
  COMPLETED: "closed",
  CANCELLED: "cancelled",
};

export function ManagerEventsPage() {
  const { data: events = [], isLoading } = useManagerEvents();
  const deleteMutation = useDeleteManagerEvent();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Event deleted");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete");
      }
    }
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
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditingEvent(row); setDialogOpen(true); }}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditingEvent(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      <ListPageTemplate<ApiEvent>
        title="Managed Events"
        description="Events you have management access to."
        crumbs={[{ label: "Manager" }, { label: "Events" }]}
        columns={columns}
        rows={events}
        loading={isLoading}
        searchKeys={["name"]}
        facet={{
          label: "Status",
          key: "status",
          options: ["DRAFT", "PUBLISHED", "LIVE", "COMPLETED", "CANCELLED"],
        }}
      />
      <ManagerEventDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        event={editingEvent} 
      />
    </>
  );
}
