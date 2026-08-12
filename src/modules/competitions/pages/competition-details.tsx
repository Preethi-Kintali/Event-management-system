import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { GroupedBarChart } from "@/components/ds/charts";
import { KanbanCard } from "@/components/ds/timeline";
import { useParams } from "@tanstack/react-router";
import { useCompetition, useCompetitionDashboard } from "../services/competitions.api";

export function CompetitionDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: competition, isLoading: isCompetitionLoading } = useCompetition(id);
  const { data: dashboard, isLoading: isDashboardLoading } = useCompetitionDashboard(id);

  if (isCompetitionLoading || isDashboardLoading) {
    return <div className="p-8">Loading competition details...</div>;
  }

  if (!competition) {
    return <div className="p-8">Competition not found</div>;
  }

  return (
    <DetailsPageTemplate
      title={competition.name}
      description={competition.description || "Competition details"}
      crumbs={[
        { label: "Programs" },
        { label: "Competitions", to: "/competitions" },
        { label: "Competition details" },
      ]}
      meta={
        <>
          <StatusChip status="active" />
          <span className="text-xs text-muted-foreground">Created on {new Date(competition.createdAt).toLocaleDateString()}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit</Button>
          <Button>Share</Button>
        </>
      }
      metrics={[
        { label: "Teams", value: dashboard?.metrics?.teams.toString() || "0" },
        { label: "Submissions", value: dashboard?.metrics?.submissions.toString() || "0" },
        { label: "Avg score", value: dashboard?.metrics?.avgScore.toString() || "0" },
        { label: "Judges", value: dashboard?.metrics?.judges.toString() || "0" },
      ]}
      overview={
        <>
          <SectionCard title="Evaluation load" description="Pending vs completed per round">
            <GroupedBarChart
              data={dashboard?.evaluationLoad || []}
              xKey="round"
              series={[
                { key: "completed", label: "Completed" },
                { key: "pending", label: "Pending" },
              ]}
              stacked
              height={260}
            />
          </SectionCard>
          <SectionCard title="Submission board" description="Drag-free kanban view" padded={false}>
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
              {(dashboard?.kanbanColumns || []).map((column: any) => (
                <div key={column.id} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {column.title} · {column.items.length}
                  </p>
                  {column.items.map((item: any) => (
                    <KanbanCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.team}
                      meta={item.id.substring(0, 8)}
                      badge={<StatusChip status={item.status.toLowerCase()} />}
                    />
                  ))}
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      }
    />
  );
}
