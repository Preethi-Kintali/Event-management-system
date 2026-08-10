import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { GroupedBarChart } from "@/components/ds/charts";
import { Timeline } from "@/components/ds/timeline";
import { AIValidationService } from "../services/ai-validation.service";
import { ValidationSummary } from "../types/ai-validation.types";
import { timeline } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function AIValidationDashboard() {
  const [summary, setSummary] = useState<ValidationSummary | null>(null);

  useEffect(() => {
    AIValidationService.getDashboardSummary().then(setSummary);
  }, []);

  return (
    <>
      <PageHeader
        title="AI Validation"
        description="Automated compliance and integrity checks for submissions."
        crumbs={[{ label: "AI & Automation" }, { label: "AI Validation" }]}
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Validated Submissions"
            value={summary.validatedSubmissions.toString()}
            progress={(summary.validatedSubmissions / summary.totalSubmissions) * 100}
            index={0}
          />
          <StatCard
            label="Flagged Submissions"
            value={summary.flaggedSubmissions.toString()}
            hint="Requires manual review"
            index={1}
          />
          <StatCard
            label="Plagiarism Flags"
            value={summary.plagiarismFlags.toString()}
            delta={4.2}
            index={2}
          />
          <StatCard
            label="AI Content Flags"
            value={summary.aiContentFlags.toString()}
            delta={12.5}
            index={3}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Validation Trends" description="Submissions processed over time">
            <GroupedBarChart
              data={[
                { date: "1 Sep", processed: 420, flagged: 12 },
                { date: "2 Sep", processed: 840, flagged: 28 },
                { date: "3 Sep", processed: 1120, flagged: 45 },
                { date: "4 Sep", processed: 1680, flagged: 78 },
                { date: "5 Sep", processed: 2450, flagged: 112 },
              ]}
              xKey="date"
              series={[
                { key: "processed", label: "Processed" },
                { key: "flagged", label: "Flagged" },
              ]}
              height={260}
            />
          </SectionCard>

          <div className="grid gap-6 md:grid-cols-3">
            <SectionCard title="Duplicate Flags" description="Cross-event analysis" padded={true}>
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <ShieldAlert className="w-10 h-10 text-warning mb-3 opacity-80" />
                <span className="text-3xl font-bold">{summary?.duplicateFlags || 0}</span>
                <span className="text-sm text-muted-foreground mt-1">matches found</span>
              </div>
            </SectionCard>
            <SectionCard title="Code Quality" description="Static analysis issues" padded={true}>
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="text-3xl font-bold">{summary?.codeQualityIssues || 0}</span>
                <span className="text-sm text-muted-foreground mt-1">critical severity</span>
              </div>
            </SectionCard>
            <SectionCard title="Grammar & Syntax" description="Readability flags" padded={true}>
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="text-3xl font-bold">14</span>
                <span className="text-sm text-muted-foreground mt-1">needs translation</span>
              </div>
            </SectionCard>
          </div>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Recent Flags" description="Action required">
            <ul className="divide-y divide-border">
              {[
                { id: "SUB-4412", issue: "92% Plagiarism Match", time: "10 mins ago" },
                { id: "SUB-8812", issue: "AI Generated Content", time: "22 mins ago" },
                { id: "SUB-1920", issue: "Duplicate Submission", time: "1 hour ago" },
                { id: "SUB-2241", issue: "Critical Security Flaw", time: "3 hours ago" },
                { id: "SUB-5120", issue: "Empty Repository", time: "5 hours ago" },
              ].map((item) => (
                <li key={item.id} className="py-3 flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.id}</p>
                    <p className="text-xs text-muted-foreground">{item.issue}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="System Activity" description="Validation engine">
            <Timeline items={timeline.slice(0, 4)} />
          </SectionCard>
        </aside>
      </div>
    </>
  );
}
