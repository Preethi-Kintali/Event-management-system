import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { SecurityService } from "../services/security.service";
import { SecurityDashboardSummary, SecurityAlert } from "../types/security.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ShieldAlert, AlertTriangle, UserCheck, Lock } from "lucide-react";

export function SecurityDashboard() {
  const [summary, setSummary] = useState<SecurityDashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);

  useEffect(() => {
    SecurityService.getDashboardSummary().then(setSummary);
    SecurityService.getAlerts().then(setAlerts);
  }, []);

  return (
    <>
      <PageHeader
        title="Security & Compliance"
        description="Monitor platform security posture and manage access policies."
        crumbs={[{ label: "System / Admin" }, { label: "Security" }]}
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Security Score"
            value={`${summary.securityScore}/100`}
            progress={summary.securityScore}
            index={0}
          />
          <StatCard label="Active Sessions" value={summary.activeSessions.toString()} index={1} />
          <StatCard label="MFA Adoption" value={`${summary.mfaAdoptionPct}%`} index={2} />
          <StatCard
            label="Failed Logins (24h)"
            value={summary.failedLogins24h.toString()}
            delta={-12.5}
            index={3}
          />
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="h-10 justify-start" asChild>
              <Link to="/security/events">
                <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> View Audit Logs
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 justify-start border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
              asChild
            >
              <Link to="/security/alerts">
                <ShieldAlert className="w-4 h-4 mr-2" />
                {summary.criticalAlerts} Critical Alerts
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Active Alerts" description="Security incidents requiring attention">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-4 p-4 border border-border rounded-lg bg-surface"
              >
                <div
                  className={`mt-0.5 p-2 rounded-full h-8 w-8 flex items-center justify-center ${
                    alert.severity === "Critical"
                      ? "bg-destructive/20 text-destructive"
                      : alert.severity === "High"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-blue-500/20 text-blue-500"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm">{alert.alert}</h4>
                    <span className="text-[10px] text-muted-foreground">{alert.created}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Source: {alert.source} • Status: {alert.status}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Investigate
                    </Button>
                    {alert.status !== "Resolved" && (
                      <Button size="sm" className="h-7 text-xs">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Security Recommendations" description="Actions to improve your score">
            <div className="space-y-4">
              <div className="flex gap-3 items-center p-3 rounded-md bg-muted/40 border border-border/50">
                <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Enforce MFA for all Admin accounts</p>
                  <p className="text-xs text-muted-foreground">
                    3 admin accounts do not have MFA enabled.
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/security/authentication">Configure</Link>
                </Button>
              </div>
              <div className="flex gap-3 items-center p-3 rounded-md bg-muted/40 border border-border/50">
                <UserCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Review idle sessions</p>
                  <p className="text-xs text-muted-foreground">
                    45 sessions have been idle for over 30 days.
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/security/sessions">Review</Link>
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Compliance Posture" description="Current regulatory standing">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded border border-border bg-surface text-center">
                <div className="text-2xl font-bold text-emerald-500 mb-1">GDPR</div>
                <div className="text-xs text-muted-foreground">Compliant</div>
              </div>
              <div className="p-4 rounded border border-border bg-surface text-center">
                <div className="text-2xl font-bold text-emerald-500 mb-1">SOC 2</div>
                <div className="text-xs text-muted-foreground">Ready</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
