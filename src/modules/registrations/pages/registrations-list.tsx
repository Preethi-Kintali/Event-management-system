import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useRegistrations, useDeleteRegistration, ApiRegistration } from "../services/registrations.api";
import { RegistrationDialog } from "../components/registration-dialog";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

const columns: Column<ApiRegistration>[] = [
  {
    key: "userId",
    header: "Participant",
    sortable: true,
    render: (row) => {
      const name = row.user
        ? `${row.user.firstName ?? ""} ${row.user.lastName ?? ""}`.trim() || row.user.email
        : "—";
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    key: "eventId",
    header: "Event",
    sortable: true,
    render: (row) => <span>{row.event?.name ?? "—"}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={statusLabel[row.status] ?? row.status} />,
  },
  {
    key: "createdAt",
    header: "Submitted",
    sortable: true,
    render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
];

export function RegistrationsListPage() {
  const { data: registrations = [], isLoading } = useRegistrations();
  const deleteMutation = useDeleteRegistration();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<ApiRegistration | null>(null);

  const handleEdit = (row: ApiRegistration) => {
    setEditingReg(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ApiRegistration) => {
    if (!confirm("Remove this registration? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Registration removed");
    } catch {
      toast.error("Failed to remove registration");
    }
  };

  const pending = registrations.filter((r) => r.status === "PENDING").length;
  const approved = registrations.filter((r) => r.status === "APPROVED").length;

  return (
    <>
      <ListPageTemplate<ApiRegistration>
        title="Registrations"
        description="Approve, review and manage participant registrations."
        crumbs={[{ label: "Programs" }, { label: "Registrations" }]}
        columns={columns}
        rows={registrations}
        loading={isLoading}
        searchKeys={["eventId"]}
        stats={[
          { label: "Total registrations", value: String(registrations.length) },
          { label: "Pending approval", value: String(pending), hint: "Awaiting review" },
          { label: "Approved", value: String(approved) },
        ]}
        facet={{
          label: "Status",
          key: "status",
          options: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
        }}
        rowActions={[
          { label: "Update status", onSelect: (row) => handleEdit(row) },
          { label: "Remove", onSelect: (row) => handleDelete(row) },
        ]}
      />
      <RegistrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        registration={editingReg}
      />
    </>
  );
}
