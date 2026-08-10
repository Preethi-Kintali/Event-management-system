import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ds/states";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Ascent Platform" },
      {
        name: "description",
        content: "Scheduled and on-demand operational reports across every module.",
      },
      { property: "og:title", content: "Reports · Ascent Platform" },
      {
        property: "og:description",
        content: "Scheduled and on-demand operational reports across every module.",
      },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  {
    id: "rep_1",
    name: "Event performance summary",
    cadence: "Weekly · Monday 08:00",
    format: "PDF",
    owner: "Ananya Iyer",
  },
  {
    id: "rep_2",
    name: "Registration reconciliation",
    cadence: "Daily · 23:00",
    format: "CSV",
    owner: "Finance ops",
  },
  {
    id: "rep_3",
    name: "Judge completion report",
    cadence: "On demand",
    format: "XLSX",
    owner: "Program office",
  },
  {
    id: "rep_4",
    name: "Sponsor deliverables",
    cadence: "Monthly · 1st",
    format: "PDF",
    owner: "Partnerships",
  },
  {
    id: "rep_5",
    name: "Certificate issuance audit",
    cadence: "Quarterly",
    format: "CSV",
    owner: "Compliance",
  },
];

function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Configure scheduled exports or generate an ad-hoc report."
        crumbs={[{ label: "Insights" }, { label: "Reports" }]}
        actions={
          <Button onClick={() => toast.success("Report generation queued")}>
            <FileBarChart className="h-4 w-4" />
            New report
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard
          title="Scheduled reports"
          description={`${reports.length} active schedules`}
          padded={false}
        >
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.cadence} · {r.owner}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">{r.format}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Download ${r.name}`}
                    onClick={() => toast.success("Download started")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Recent exports" description="Last 30 days" padded={false}>
          <EmptyState
            title="No exports yet"
            description="Generated files appear here for 30 days before automatic deletion."
            actionLabel="Generate report"
          />
        </SectionCard>
      </div>
    </>
  );
}
