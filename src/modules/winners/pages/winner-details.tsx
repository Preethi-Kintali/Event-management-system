import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ds/timeline";
import { WinnersService } from "../services/winners.service";
import { Winner } from "../types/winners.types";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Trophy, FileBadge, Gift } from "lucide-react";

export function WinnerDetailsPage() {
  const [record, setRecord] = useState<Winner | null>(null);
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  useEffect(() => {
    WinnersService.getWinnerById(id).then((r) => setRecord(r || null));
  }, [id]);

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={record.winner}
      description={record.team ? `Team: ${record.team}` : "Individual Participant"}
      crumbs={[
        { label: "Engagement" },
        { label: "Winners", to: "/winners" },
        { label: record.winner },
      ]}
      meta={
        <>
          <StatusChip status={record.status === "Prize Distributed" ? "published" : "active"} />
          <span className="text-xs text-muted-foreground">{record.competition}</span>
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
        { label: "Final Score", value: record.score.toString() },
        { label: "Prize Allocation", value: record.prize },
        { label: "Announced", value: record.announcementDate || "Pending" },
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
                  final score of {record.score}.
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
                  time: record.announcementDate || "Pending",
                  state: record.status === "Announced" ? "done" : "current",
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
