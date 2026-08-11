import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import type { Column } from "@/components/ds/data-table";
import { useTeams, useDeleteTeam, ApiTeam } from "../services/teams.api";
import { TeamDialog } from "../components/team-dialog";
import { toast } from "sonner";

const columns: Column<ApiTeam>[] = [
  {
    key: "name",
    header: "Team",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "competitionId",
    header: "Competition",
    sortable: true,
    render: (row) => <span>{row.competition?.name ?? "—"}</span>,
  },
  {
    key: "_count",
    header: "Members",
    render: (row) => <span className="tabular-nums">{row._count?.members ?? 0}</span>,
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
];

export function TeamsListPage() {
  const { data: teams = [], isLoading } = useTeams();
  const deleteMutation = useDeleteTeam();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ApiTeam | null>(null);

  const handleEdit = (row: ApiTeam) => {
    setEditingTeam(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ApiTeam) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Team deleted");
    } catch {
      toast.error("Failed to delete team");
    }
  };

  return (
    <>
      <ListPageTemplate<ApiTeam>
        title="Teams"
        description="Team formation and membership across all competitions."
        crumbs={[{ label: "Programs" }, { label: "Teams" }]}
        columns={columns}
        rows={teams}
        loading={isLoading}
        searchKeys={["name"]}
        stats={[
          { label: "Total teams", value: String(teams.length) },
          {
            label: "Total members",
            value: String(teams.reduce((s, t) => s + (t._count?.members ?? 0), 0)),
          },
          {
            label: "Avg team size",
            value: teams.length
              ? (teams.reduce((s, t) => s + (t._count?.members ?? 0), 0) / teams.length).toFixed(1)
              : "—",
          },
        ]}
        createLabel="Create team"
        onCreate={() => {
          setEditingTeam(null);
          setDialogOpen(true);
        }}
        rowActions={[
          { label: "Edit", onSelect: (row) => handleEdit(row) },
          { label: "Delete", onSelect: (row) => handleDelete(row) },
        ]}
      />
      <TeamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        team={editingTeam}
      />
    </>
  );
}
