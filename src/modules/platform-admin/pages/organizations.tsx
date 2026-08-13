import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useOrganizations, useUpdateOrganization, useDeleteOrganization } from "../services/organizations.api";
import { Organization } from "../types/platform-admin.types";
import { useState } from "react";
import { toast } from "sonner";
import { OrganizationDialog } from "../components/organization-dialog";
import { Button } from "@/components/ui/button";

const columns: Column<Organization>[] = [
  {
    key: "name",
    header: "Organization",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: "slug", header: "Slug", sortable: true },
  { 
    key: "createdAt" as any, 
    header: "Created Date", 
    sortable: true,
    render: (row: any) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

export function OrganizationsPage() {
  const { data = [], isLoading, isError } = useOrganizations();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const handleCreate = () => {
    setSelectedOrg(null);
    setDialogOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setSelectedOrg(org);
    setDialogOpen(true);
  };

  const handleStatusChange = async (org: Organization, status: string) => {
    try {
      await updateMutation.mutateAsync({ id: org.id, status });
      toast.success(`Organization ${status === 'ACTIVE' ? 'approved' : 'suspended'}`);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <ListPageTemplate<Organization>
        title="Organizations"
        description="Manage all organizations across the platform."
        crumbs={[{ label: "Platform" }, { label: "Organizations" }]}
        columns={columns}
        rows={data}
        loading={isLoading}
        error={isError}
        searchKeys={["name", "slug", "plan"]}
        stats={[
          { label: "Total Organizations", value: String(data.length) },
          { label: "Active Organizations", value: String(data.filter((o) => o.status === "ACTIVE").length) },
        ]}
        createLabel="Add Organization"
        onCreate={handleCreate}
        rowActions={[
          { label: "Edit details", onSelect: handleEdit },
          { label: "Approve", onSelect: (org) => handleStatusChange(org, "ACTIVE") },
          { label: "Suspend", onSelect: (org) => handleStatusChange(org, "SUSPENDED") },
        ]}
      />
      <OrganizationDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        organization={selectedOrg} 
      />
    </>
  );
}
