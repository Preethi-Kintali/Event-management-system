import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useSubmissions, useDeleteSubmission, ApiSubmission } from "../services/submissions.api";
import { SubmissionDialog } from "../components/submission-dialog";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  DRAFT: "draft",
  SUBMITTED: "pending",
  IN_REVIEW: "in_review",
  EVALUATED: "closed",
  DISQUALIFIED: "cancelled",
};

const columns: Column<ApiSubmission>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: "teamId",
    header: "Team",
    sortable: true,
    render: (row) => <span>{row.team?.name ?? "—"}</span>,
  },
  {
    key: "competitionId",
    header: "Competition",
    sortable: true,
    render: (row) => <span>{row.competition?.name ?? "—"}</span>,
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

export function SubmissionsListPage() {
  const { data: submissions = [], isLoading } = useSubmissions();
  const deleteMutation = useDeleteSubmission();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<ApiSubmission | null>(null);

  const handleEdit = (row: ApiSubmission) => {
    setEditingSub(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ApiSubmission) => {
    if (!confirm(`Delete submission "${row.title}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Submission deleted");
    } catch {
      toast.error("Failed to delete submission");
    }
  };

  const inReview = submissions.filter((s) => s.status === "IN_REVIEW" || s.status === "SUBMITTED").length;

  return (
    <>
      <ListPageTemplate<ApiSubmission>
        title="Submissions"
        description="Every submission with status and reviewer coverage."
        crumbs={[{ label: "Programs" }, { label: "Submissions" }]}
        columns={columns}
        rows={submissions}
        loading={isLoading}
        searchKeys={["title"]}
        stats={[
          { label: "Total submissions", value: String(submissions.length) },
          { label: "Awaiting review", value: String(inReview) },
          { label: "Evaluated", value: String(submissions.filter((s) => s.status === "EVALUATED").length) },
        ]}
        facet={{
          label: "Status",
          key: "status",
          options: ["DRAFT", "SUBMITTED", "IN_REVIEW", "EVALUATED", "DISQUALIFIED"],
        }}
        rowActions={[
          { label: "Update status", onSelect: (row) => handleEdit(row) },
          { label: "Delete", onSelect: (row) => handleDelete(row) },
        ]}
      />
      <SubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        submission={editingSub}
      />
    </>
  );
}
