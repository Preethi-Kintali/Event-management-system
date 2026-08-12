import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { useComplianceStatus } from "../hooks/security.hooks";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Download, Trash2, Globe2 } from "lucide-react";

export function CompliancePage() {
  const { activeOrganization } = useAuth();
  const tenantId = activeOrganization || "";
  const { data: status, isLoading } = useComplianceStatus(tenantId);

  if (isLoading || !status) return null;

  return (
    <>
      <PageHeader
        title="Privacy & Compliance"
        description="Manage data retention policies and regulatory compliance settings."
        crumbs={[
          { label: "System / Admin" },
          { label: "Security", to: "/security" },
          { label: "Compliance" },
        ]}
      />

      <div className="grid gap-6 mt-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <SectionCard
            title="Data Retention Policy"
            description="Configure how long user data is stored before automatic deletion."
          >
            <div className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <Label>Default Data Retention Period (Days)</Label>
                <div className="flex gap-2">
                  <Input type="number" defaultValue={status.dataRetentionDays} className="w-32" />
                  <Button variant="outline">Update</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  After this period, inactive user data will be permanently purged.
                </p>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymize rather than delete</Label>
                    <p className="text-xs text-muted-foreground">
                      Keep analytics data but strip personally identifiable information (PII).
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Consent Management"
            description="Manage cookie preferences and terms of service acceptance."
          >
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Explicit Cookie Consent</Label>
                  <p className="text-xs text-muted-foreground">
                    Display cookie banner for EU IP addresses automatically.
                  </p>
                </div>
                <Switch defaultChecked={status.cookieConsentRequired} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Strict Consent Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Block all non-essential scripts until consent is given.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
                GDPR Compliant
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your current settings meet standard GDPR requirements for data handling and consent.
            </p>
          </div>

          <SectionCard title="Data Requests" description="Pending user privacy actions">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-muted/40 border border-border/50">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Export Requests</span>
                </div>
                <span className="tabular-nums font-semibold">{status.userExportRequests}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-muted/40 border border-border/50">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium">Deletion Requests</span>
                </div>
                <span className="tabular-nums font-semibold text-destructive">
                  {status.pendingDeletions}
                </span>
              </div>
              <Button variant="outline" className="w-full text-xs">
                Process Requests
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
