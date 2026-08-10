import { PageHeader } from "@/components/ds/page-header";
import { AICopilotService } from "../services/ai-copilot.service";
import { AIRecommendation } from "../types/ai-copilot.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    AICopilotService.getRecommendations().then(setRecommendations);
  }, []);

  return (
    <>
      <PageHeader
        title="AI Recommendations"
        description="Actionable, data-driven insights to optimize your platform operations."
        crumbs={[
          { label: "AI & Automation" },
          { label: "Copilot", to: "/ai-copilot" },
          { label: "Recommendations" },
        ]}
      />

      <div className="grid gap-6 mt-6 max-w-4xl">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex gap-4 p-6 border border-border rounded-lg bg-surface relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />

            <div className="bg-primary/10 text-primary p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{rec.title}</h3>
                    <Badge variant="outline">{rec.category}</Badge>
                    {rec.priority === "High" && (
                      <Badge
                        variant="secondary"
                        className="bg-destructive/10 text-destructive border-transparent"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" /> High Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular-nums text-primary">{rec.score}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                    Confidence
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-md border border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Suggested Action</p>
                  <p className="text-sm">{rec.action}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Expected Impact</p>
                  <p className="text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-4 h-4" /> {rec.expectedImpact}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" size="sm">
                  Dismiss
                </Button>
                <Button size="sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Apply Suggestion
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
