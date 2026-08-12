import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useRoles, useDeleteRole } from "../services/roles.api";
import { PlatformRole } from "../types/platform-admin.types";
import { useState } from "react";
import { RoleDialog } from "../components/role-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const columns: Column<PlatformRole>[] = [
  {
    key: "name",
    header: "Role Name",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { 
    key: "scope", 
    header: "Scope", 
    sortable: true,
    render: (row: any) => <span>{row.scope || (row.organizationId ? "Organization" : "Global")}</span>
  },
  {
    key: "description",
    header: "Description",
    sortable: false,
    render: (row) => (
      <span className="text-muted-foreground truncate max-w-[300px] block">{row.description}</span>
    ),
  },
  { 
    key: "users", 
    header: "Users", 
    sortable: true,
    render: (row: any) => <span>{row.users ?? row._count?.members ?? 0}</span>
  },
  { 
    key: "permissions", 
    header: "Permissions", 
    sortable: false,
    render: (row) => {
      const perms = Array.isArray(row.permissions) ? row.permissions : [];
      if (perms.length === 0) return <span className="text-muted-foreground">None</span>;
      
      // Limit to max 3 chips to prevent huge rows, with a "+X more" chip
      const displayPerms = perms.slice(0, 3);
      const remaining = perms.length - 3;
      
      return (
        <div className="flex flex-wrap gap-1 max-w-[400px]">
          {displayPerms.map((p: any, i: number) => {
            const label = p.permission?.name || p.permission?.action || p.name || 'Permission';
            return (
              <span key={i} className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {label}
              </span>
            );
          })}
          {remaining > 0 && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
              +{remaining} more
            </span>
          )}
        </div>
      );
    }
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status="approved" />,
  },
];

export function PermissionsPage() {
  const { data = [], isLoading, isError } = useRoles();
  const deleteMutation = useDeleteRole();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PlatformRole | null>(null);

  const handleCreate = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  const handleEdit = (role: PlatformRole) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleDelete = async (role: PlatformRole) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteMutation.mutateAsync(role.id);
        toast.success("Role deleted");
      } catch (e) {
        toast.error("Failed to delete role");
      }
    }
  };

  return (
    <>
      <ListPageTemplate<PlatformRole>
        title="Roles & Permissions"
        description="Manage enterprise access controls and role-based permissions."
        crumbs={[{ label: "Platform" }, { label: "Roles" }]}
        columns={columns}
        rows={data}
        loading={isLoading}
        error={isError}
        searchKeys={["name", "scope", "description"]}
        facet={{
          label: "Scope",
          key: "scope",
          options: ["Global", "Organization", "Event", "Competition"],
        }}
        createLabel="Create Role"
        onCreate={handleCreate}
        rowActions={[
          { label: "Edit role", onSelect: handleEdit },
          { label: "Delete", onSelect: handleDelete },
        ]}
      />
      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
      />
    </>
  );
}
