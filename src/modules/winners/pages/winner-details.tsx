import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ds/timeline";
import { useWinner } from "../services/winners.api";
import { useParams } from "@tanstack/react-router";
import { Trophy, FileBadge, Gift } from "lucide-react";

export function WinnerDetailsPage() {
  const { id } = useParams({ strict: false }) as any;
  const { data: record, isLoading } = useWinner(id);

  if (isLoading || !record) return null;

  return (
    <DetailsPageTemplate
      title={record.user ? `${record.user.firstName} ${record.user.lastName}` : record.team?.name || "Unknown"}
      description={record.team ? `Team: ${record.team.name}` : "Individual Participant"}
      crumbs={[
        { label: "Engagement" },
        { label: "Winners", to: "/winners" },
        { label: record.winner },
      ]}
      meta={
        <>
          <StatusChip status={record.status === "FINALIZED" ? "published" : "active"} />
          <span className="text-xs text-muted-foreground">{record.competition?.name}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">
            <FileBadge className="w-4 h-4 mr-2" />
            View Certificate
          </Button>
          <Button>
            <Gift className="w-4 h-4 mr-2" />
            Process Prize
          </Button>
        </>
      }
      metrics={[
        { label: "Position", value: record.position },
        { label: "Score", value: record.submission?.evaluations?.[0]?.score?.toString() || "N/A" },
        { label: "Prize Allocation", value: record.prize?.name || "None" },
        { label: "Announced", value: new Date(record.createdAt).toLocaleDateString() },
      ]}
      overview={
        <>
          <SectionCard title="Winning Submission" description="The project that won">
            <div className="flex gap-4">
              <Trophy className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Project Payload</p>
                <p className="text-sm text-muted-foreground mb-4">
                  View the repository, presentation, and judge feedback that contributed to the
                  final score of {record.submission?.evaluations?.[0]?.score || 0}.
                </p>
                <Button variant="outline" size="sm">
                  Open Submission Details
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Distribution Timeline" description="Prize and certificate processing">
            <Timeline
              items={[
                {
                  id: "1",
                  title: "Results Confirmed",
                  detail: "Judges locked final scores.",
                  time: "July 28",
                  state: "done",
                },
                {
                  id: "2",
                  title: "Winner Announced",
                  detail: "Public announcement made.",
                  time: new Date(record.createdAt).toLocaleDateString(),
                  state: record.status === "FINALIZED" ? "done" : "current",
                },
                {
                  id: "3",
                  title: "Certificate Issued",
                  detail: "Digital certificate sent to email.",
                  time: "Pending",
                  state: "upcoming",
                },
                {
                  id: "4",
                  title: "Prize Distributed",
                  detail: `${record.prize} transfer.`,
                  time: "Pending",
                  state: "upcoming",
                },
              ]}
            />
          </SectionCard>
        </>
      }
    />
  );
}
