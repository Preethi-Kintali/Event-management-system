import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Medal, CheckCircle2, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";

export function WinnerSelectionPage() {
  return (
    <>
      <PageHeader
        title="Winner Selection"
        description="Finalize competition results and allocate podium positions."
        crumbs={[
          { label: "Engagement" },
          { label: "Winners", to: "/winners" },
          { label: "Selection" },
        ]}
        actions={<Button>Confirm Results & Announce</Button>}
      />

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <SectionCard title="Target Competition" description="Select competition to judge">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="comp">Competition</Label>
              <Select defaultValue="c1">
                <SelectTrigger id="comp">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">AI for Accessibility Track</SelectItem>
                  <SelectItem value="c2">Campus Robotics Sprint</SelectItem>
                  <SelectItem value="c3">Impact Business Model Case</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 text-sm">
              <p className="text-muted-foreground mb-2">Evaluation Status</p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-medium">
                <CheckCircle2 className="w-4 h-4" /> 100% Graded
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All judges have submitted scores. Ready for final selection.
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Top Finalists by Weighted Score</h3>

          <div className="space-y-4">
            {[
              { rank: 1, team: "Neural Nomads", score: 96.5, pos: "Winner" },
              { rank: 2, team: "Circuit Breakers", score: 91.2, pos: "Runner-up" },
              { rank: 3, team: "Data Drifters", score: 89.8, pos: "Second Runner-up" },
              { rank: 4, team: "Visionaries", score: 88.5, pos: "Finalist" },
              { rank: 5, team: "Airfoil Collective", score: 84.0, pos: "Special Mention" },
            ].map((team) => (
              <div
                key={team.rank}
                className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-shrink-0 w-12 text-center">
                  <span className="text-2xl font-bold text-muted-foreground">#{team.rank}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{team.team}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span>
                      Score:{" "}
                      <span className="font-mono text-foreground font-medium">{team.score}</span>
                    </span>
                    <span className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                      <MessageSquare className="w-3 h-3" /> View Judge Feedback
                    </span>
                  </p>
                </div>
                <div className="w-48">
                  <Select defaultValue={team.pos.toLowerCase().replace(" ", "-")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="winner">Winner (1st)</SelectItem>
                      <SelectItem value="runner-up">Runner-up (2nd)</SelectItem>
                      <SelectItem value="second-runner-up">Second Runner-up (3rd)</SelectItem>
                      <SelectItem value="finalist">Finalist</SelectItem>
                      <SelectItem value="special-mention">Special Mention</SelectItem>
                      <SelectItem value="none">No Position</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
