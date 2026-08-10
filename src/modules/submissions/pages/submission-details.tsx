import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { scorecardCriteria } from "@/lib/mock-data";

export function SubmissionDetailsPage() {
  return (
    <DetailsPageTemplate
      title="SUB-2291 · SignBridge"
      description="Realtime sign language captions · Neural Nomads · Round 2"
      crumbs={[
        { label: "Programs" },
        { label: "Submissions", to: "/submissions" },
        { label: "Submission details" },
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
        { label: "Score", value: "87.5", caption: "weighted average" },
        { label: "Reviewers", value: "2 of 3" },
        { label: "Plagiarism", value: "0 flags" },
        { label: "Round", value: "Round 2" },
      ]}
      related={[
        { id: "r1", label: "Neural Nomads", meta: "Team · 4 members" },
        { id: "r2", label: "AI for Accessibility Track", meta: "Competition" },
        { id: "r3", label: "Dr. Elena Marković", meta: "Reviewer · scored 88" },
      ]}
      overview={
        <SectionCard title="Scorecard breakdown" description="Weighted criteria" padded={false}>
          <ul className="divide-y divide-border">
            {scorecardCriteria.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="truncate text-sm font-medium">{c.label}</p>
                  <span className="shrink-0 text-sm tabular-nums">
                    {c.score} / {c.weight}
                  </span>
                </div>
                <Progress value={(c.score / c.weight) * 100} className="mt-2 h-1.5" />
                <p className="mt-2 text-xs text-muted-foreground">{c.notes}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      }
    />
  );
}
