import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { AuthUser } from "@/lib/auth";
import { useUsers, useUpdateUserStatus } from "@/modules/users/services/users.api";
import { UserDialog } from "@/modules/users/components/user-dialog";
import { useState } from "react";
import { toast } from "sonner";

type Row = AuthUser;

const columns: Column<Row>[] = [
  {
    key: "name",
    header: "User",
    sortable: true,
    render: (row) => <span className="font-medium">{row.firstName} {row.lastName}</span>,
  },
  { key: "email", header: "Email", sortable: true },
  {
    key: "mfa",
    header: "MFA",
    sortable: false,
    render: () => <StatusChip status="approved" />,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
  { 
    key: "createdAt", 
    header: "Joined",
    render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>
  },
];

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users · Ascent Platform" },
      {
        name: "description",
        content: "Directory of every platform user with roles, organizations and security posture.",
      },
      { property: "og:title", content: "Users · Ascent Platform" },
      {
        property: "og:description",
        content: "Directory of every platform user with roles, organizations and security posture.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { data = [], isLoading, isError } = useUsers();
  const updateStatusMutation = useUpdateUserStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const handleEdit = (user: AuthUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleStatusChange = async (user: AuthUser, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: user.id, status });
      toast.success(`User status updated to ${status}`);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <ListPageTemplate<Row>
        title="Users"
        description="Directory of every platform user with roles, organizations and security posture."
        crumbs={[{ label: "Administration" }, { label: "Users" }]}
        columns={columns}
        rows={data}
        loading={isLoading}
        error={isError}
        searchKeys={["firstName", "lastName", "email"]}
        stats={[
          { label: "Total users", value: String(data.length) },
          { label: "Active users", value: String(data.filter((u) => u.status === "ACTIVE").length) },
        ]}
        rowActions={[
          { label: "Edit profile", onSelect: handleEdit },
          { label: "Activate", onSelect: (user) => handleStatusChange(user, "ACTIVE") },
          { label: "Suspend", onSelect: (user) => handleStatusChange(user, "SUSPENDED") },
        ]}
      />
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
      />
    </>
  );
}
