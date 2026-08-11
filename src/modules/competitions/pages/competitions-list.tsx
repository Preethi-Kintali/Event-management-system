import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useCompetitions, useDeleteCompetition, ApiCompetition } from "../services/competitions.api";
import { CompetitionDialog } from "../components/competition-dialog";
import { toast } from "sonner";

const columns: Column<ApiCompetition>[] = [
  {
    key: "name",
    header: "Competition",
    sortable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "eventId",
    header: "Event",
    sortable: true,
    render: (row) => <span>{row.event?.name ?? "—"}</span>,
  },
  {
    key: "_count",
    header: "Teams",
    render: (row) => <span className="tabular-nums">{row._count?.teams ?? 0}</span>,
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
];

export function CompetitionsListPage() {
  const { data: competitions = [], isLoading } = useCompetitions();
  const deleteMutation = useDeleteCompetition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<ApiCompetition | null>(null);

  const handleEdit = (row: ApiCompetition) => {
    setEditingComp(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ApiCompetition) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Competition deleted");
    } catch {
      toast.error("Failed to delete competition");
    }
  };

  return (
    <>
      <ListPageTemplate<ApiCompetition>
        title="Competitions"
        description="Hackathons, case studies and challenges with rounds, teams and submissions."
        crumbs={[{ label: "Programs" }, { label: "Competitions" }]}
        columns={columns}
        rows={competitions}
        loading={isLoading}
        searchKeys={["name"]}
        stats={[
          { label: "Total competitions", value: String(competitions.length) },
          { label: "Total teams", value: String(competitions.reduce((s, c) => s + (c._count?.teams ?? 0), 0)) },
          { label: "Total submissions", value: String(competitions.reduce((s, c) => s + (c._count?.submissions ?? 0), 0)) },
        ]}
        createLabel="New competition"
        onCreate={() => {
          setEditingComp(null);
          setDialogOpen(true);
        }}
        rowActions={[
          { label: "Edit", onSelect: (row) => handleEdit(row) },
          { label: "Delete", onSelect: (row) => handleDelete(row) },
        ]}
      />
      <CompetitionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        competition={editingComp}
      />
    </>
  );
}
