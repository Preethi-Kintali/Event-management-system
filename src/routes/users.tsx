import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { AuthUser } from "@/lib/auth";
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/modules/users/services/users.api";
import { UserDialog } from "@/modules/users/components/user-dialog";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Row = AuthUser & { roleName: string };

const columns: Column<Row>[] = [
  {
    key: "name",
    header: "User",
    sortable: true,
    render: (row) => <span className="font-medium">{row.firstName} {row.lastName}</span>,
  },
  { key: "email", header: "Email", sortable: true },
  {
    key: "roleName",
    header: "Role",
    sortable: true,
    render: (row) => <Badge variant="outline">{row.roleName}</Badge>,
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
  const deleteMutation = useDeleteUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const rows: Row[] = useMemo(() => {
    return data.map((user) => ({
      ...user,
      roleName: user.memberships?.[0]?.role?.name || "User",
    }));
  }, [data]);

  const roleOptions = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.roleName))).sort();
  }, [rows]);

  const handleEdit = (user: AuthUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleDelete = async (user: AuthUser) => {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await deleteMutation.mutateAsync(user.id);
        toast.success("User deleted successfully");
      } catch (e) {
        toast.error("Failed to delete user");
      }
    }
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
        rows={rows}
        loading={isLoading}
        error={isError}
        searchKeys={["firstName", "lastName", "email"]}
        createLabel="Create User"
        onCreate={handleCreate}
        facet={{
          label: "Role",
          key: "roleName",
          options: roleOptions,
        }}
        stats={[
          { label: "Total users", value: String(rows.length) },
          { label: "Active users", value: String(rows.filter((u) => u.status === "ACTIVE").length) },
        ]}
        rowActions={[
          { label: "Edit profile", onSelect: handleEdit },
          { label: "Activate", onSelect: (user) => handleStatusChange(user, "ACTIVE") },
          { label: "Suspend", onSelect: (user) => handleStatusChange(user, "SUSPENDED") },
          { label: "Delete", onSelect: handleDelete },
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
