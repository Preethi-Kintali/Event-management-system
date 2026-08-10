import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { DeveloperService } from "../services/developer.service";
import { ServiceHealth } from "../types/developer.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function HealthPage() {
  const [health, setHealth] = useState<ServiceHealth[]>([]);

  useEffect(() => {
    DeveloperService.getHealth().then(setHealth);
  }, []);

  return (
    <>
      <PageHeader
        title="System Health"
        description="Real-time status of internal microservices and external dependencies."
        crumbs={[
          { label: "System / Admin" },
          { label: "Developer", to: "/developer" },
          { label: "Health" },
        ]}
        actions={
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        }
      />

      <div className="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
        {health.map((svc) => (
          <SectionCard key={svc.id} title="" description="" className="flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" /> {svc.name}
              </h3>
              <Badge
                variant={
                  svc.status === "Healthy"
                    ? "outline"
                    : svc.status === "Degraded"
                      ? "secondary"
                      : "destructive"
                }
                className={
                  svc.status === "Healthy"
                    ? "text-emerald-500 border-emerald-500/30"
                    : svc.status === "Degraded"
                      ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                      : ""
                }
              >
                {svc.status === "Healthy" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {svc.status === "Degraded" && <AlertTriangle className="w-3 h-3 mr-1" />}
                {svc.status === "Down" && <AlertCircle className="w-3 h-3 mr-1" />}
                {svc.status}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground mb-6 font-mono">
              v{svc.version} • Checked {svc.lastCheck}
            </div>

            <div className="space-y-4 mt-auto border-t border-border pt-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Uptime (30d)</span>
                  <span className="font-medium tabular-nums">{svc.uptime}%</span>
                </div>
                <Progress
                  value={svc.uptime}
                  className={`h-1.5 ${svc.uptime < 99 ? "[&>div]:bg-amber-500" : svc.uptime < 95 ? "[&>div]:bg-destructive" : ""}`}
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Avg Response</span>
                <span
                  className={`font-medium tabular-nums ${svc.responseTimeMs === 0 ? "text-destructive" : svc.responseTimeMs > 500 ? "text-amber-500" : ""}`}
                >
                  {svc.responseTimeMs === 0 ? "Timeout" : `${svc.responseTimeMs}ms`}
                </span>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
