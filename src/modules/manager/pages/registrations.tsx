import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerRegistrations, useUpdateManagerRegistrationStatus } from "../hooks/manager.api";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function ManagerRegistrationsPage() {
  const { data = [], isLoading } = useManagerRegistrations();
  const updateStatusMutation = useUpdateManagerRegistrationStatus();

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status } });
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
      key: "event",
      header: "Event",
      render: (row) => <span>{row.event?.name}</span>,
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

  return (
    <ListPageTemplate<any>
      title="Managed Registrations"
      description="View and approve registrations you manage."
      crumbs={[{ label: "Manager" }, { label: "Registrations" }]}
      columns={columns}
      rows={data}
      loading={isLoading}
      searchKeys={["id"]}
      facet={{
        label: "Status",
        key: "status",
        options: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
      }}
    />
  );
}
