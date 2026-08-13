import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useDiscoverEvents, useRegisterForEvent, useMyRegistrations } from "../hooks/participant.api";
import { ApiEvent } from "@/modules/events/services/events.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  DRAFT: "draft",
  PUBLISHED: "published",
  LIVE: "active",
  COMPLETED: "closed",
  CANCELLED: "cancelled",
};

export function ParticipantDiscoverEventsPage() {
  const { data: events = [], isLoading } = useDiscoverEvents();
  const { data: registrations = [] } = useMyRegistrations();
  const registerMutation = useRegisterForEvent();

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync({ eventId });
      toast.success("Successfully registered for event");
    } catch (err: any) {
      toast.error(err.message || "Failed to register");
    }
  };

  const isRegistered = (eventId: string) => {
    return registrations.some((reg: any) => reg.eventId === eventId);
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
      render: (row) => {
        const registered = isRegistered(row.id);
        return (
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={() => handleRegister(row.id)}
              disabled={registered || registerMutation.isPending}
              variant={registered ? "secondary" : "default"}
            >
              {registered ? "Registered" : "Register"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <ListPageTemplate<ApiEvent>
      title="Discover Events"
      description="Available events you can register for."
      crumbs={[{ label: "Participant" }, { label: "Discover Events" }]}
      columns={columns}
      rows={events}
      loading={isLoading}
      searchKeys={["name"]}
    />
  );
}
