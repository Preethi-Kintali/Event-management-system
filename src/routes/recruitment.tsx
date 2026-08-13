import { createFileRoute } from "@tanstack/react-router";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useRecruitmentCandidates, useRecruitmentDashboard } from "@/modules/recruitment/hooks/recruitment.api";
import { CandidateCreateDialog } from "@/modules/recruitment/components/candidate-create-dialog";
import { useState } from "react";

type Row = {
  id: string;
  candidate: string;
  role: string;
  company: string;
  stage: string;
  score: number;
  source: string;
  status: string;
};

const columns: Column<Row>[] = [
  {
    key: "candidate",
    header: "Candidate",
    sortable: true,
    render: (row) => <span className="font-medium">{row.candidate}</span>,
  },
  { key: "role", header: "Role", sortable: true },
  { key: "company", header: "Company", sortable: true },
  { key: "stage", header: "Stage", sortable: true },
  {
    key: "score",
    header: "Score",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.score}</span>,
  },
  { key: "source", header: "Sourced from", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => {
      let statusId = "pending";
      if (row.status === "ACTIVE") statusId = "active";
      if (row.status === "HIRED") statusId = "published";
      if (row.status === "REJECTED") statusId = "archived";
      return <StatusChip status={statusId as any} />;
    },
  },
];

export const Route = createFileRoute("/recruitment")({
  head: () => ({
    meta: [
      { title: "Recruitment · Ascent Platform" },
      {
        name: "description",
        content: "Convert competition performance into hiring pipelines and offers.",
      },
      { property: "og:title", content: "Recruitment · Ascent Platform" },
      {
        property: "og:description",
        content: "Convert competition performance into hiring pipelines and offers.",
      },
    ],
  }),
  component: RecruitmentPage,
});

function RecruitmentPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: candidates = [], isLoading: isCandidatesLoading } = useRecruitmentCandidates();
  const { data: stats, isLoading: isStatsLoading } = useRecruitmentDashboard();

  const rows: Row[] = candidates.map((c: any) => ({
    id: c.id,
    candidate: c.participant ? `${c.participant.firstName} ${c.participant.lastName}` : "Unknown",
    role: c.role || "General",
    company: c.company || "Internal",
    stage: c.stage || "Shortlisted",
    score: c.score || 0,
    source: c.source || "Application",
    status: c.status || "ACTIVE",
  }));

  if (isCandidatesLoading || isStatsLoading) {
    return <div className="p-8">Loading recruitment pipeline...</div>;
  }

  return (
    <>
    <ListPageTemplate<Row>
      title="Recruitment"
      description="Convert competition performance into hiring pipelines and offers."
      crumbs={[{ label: "People" }, { label: "Recruitment" }]}
      columns={columns}
      rows={rows}
      searchKeys={["candidate", "role", "company"]}
      stats={[
        { label: "Candidates", value: stats?.candidates?.toString() || "0" },
        { label: "Interviews", value: stats?.interviews?.toString() || "0" },
        { label: "Offers", value: stats?.offers?.toString() || "0" },
        { label: "Offer acceptance", value: `${stats?.offerAcceptance || 0}%`, progress: stats?.offerAcceptance || 0 },
      ]}
      facet={{
        label: "Stage",
        key: "stage",
        options: ["Shortlisted", "Interview", "Offer", "Rejected"],
      }}
      createLabel="Add candidate"
      onCreate={() => setIsCreateOpen(true)}
      rowActions={[
        { label: "View details", onSelect: () => {} },
        { label: "Duplicate", onSelect: () => {} },
        { label: "Archive", onSelect: () => {} },
      ]}
    />
    <CandidateCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}

