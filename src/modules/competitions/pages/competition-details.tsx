import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { GroupedBarChart } from "@/components/ds/charts";
import { KanbanCard } from "@/components/ds/timeline";
import { evaluationLoad, kanbanColumns } from "@/lib/mock-data";

export function CompetitionDetailsPage() {
  return (
    <DetailsPageTemplate
      title="AI for Accessibility Track"
      description="Hackathon · 3 rounds · $50,000 prize pool"
      crumbs={[
        { label: "Programs" },
        { label: "Competitions", to: "/competitions" },
        { label: "Competition details" },
      ]}
      meta={
        <>
          <StatusChip status="active" />
          <span className="text-xs text-muted-foreground">Last updated 12 minutes ago</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit</Button>
          <Button>Share</Button>
        </>
      }
      metrics={[
        { label: "Teams", value: "214" },
        { label: "Submissions", value: "186" },
        { label: "Avg score", value: "76.4" },
        { label: "Judges", value: "9" },
      ]}
      related={[
        { id: "r1", label: "Neural Nomads", meta: "Team · 4 members" },
        { id: "r2", label: "SUB-2291", meta: "Submission · In review" },
        { id: "r3", label: "Dr. Elena Marković", meta: "Judge · Machine Learning" },
      ]}
      overview={
        <>
          <SectionCard title="Evaluation load" description="Pending vs completed per round">
            <GroupedBarChart
              data={evaluationLoad}
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
              {kanbanColumns.map((column) => (
                <div key={column.id} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {column.title} · {column.items.length}
                  </p>
                  {column.items.map((item) => (
                    <KanbanCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.team}
                      meta={item.id}
                      badge={<StatusChip status={item.status} />}
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
