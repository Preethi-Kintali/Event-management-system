import { useState } from "react";
import { useEventRegistrations, useUpdateEventRegistrationStatus } from "../services/events.api";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, Column } from "@/components/ds/data-table";

export function EventRegistrationsList({ eventId }: { eventId: string }) {
  const { data: registrations = [], isLoading } = useEventRegistrations(eventId);
  const updateStatusMutation = useUpdateEventRegistrationStatus();

  const handleUpdateStatus = async (regId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ eventId, regId, data: { status } });
      toast.success(`Registration ${status.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "user",
      header: "User",
      render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusChip status={row.status.toLowerCase()} />,
    },
    {
      key: "createdAt",
      header: "Registered On",
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end space-x-2">
          {row.status === "PENDING" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(row.id, "APPROVED")}>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(row.id, "REJECTED")}>
                <XCircle className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading registrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Registrations</h3>
          <p className="text-sm text-muted-foreground">Approve or reject pending registrations for this event.</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={registrations}
      />
    </div>
  );
}
