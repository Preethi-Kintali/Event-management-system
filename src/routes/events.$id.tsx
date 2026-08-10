import { createFileRoute } from "@tanstack/react-router";
import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { TrendAreaChart } from "@/components/ds/charts";
import { registrationTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$id")({
  head: () => ({
    meta: [
      { title: "Global AI Innovation Summit 2026 · Ascent Platform" },
      { name: "description", content: "Hybrid · Berlin + Online · 14–17 September 2026" },
      { property: "og:title", content: "Global AI Innovation Summit 2026 · Ascent Platform" },
      { property: "og:description", content: "Hybrid · Berlin + Online · 14–17 September 2026" },
    ],
  }),
  component: EventDetailsPage,
});

function EventDetailsPage() {
  return (
    <DetailsPageTemplate
      title="Global AI Innovation Summit 2026"
      description="Hybrid · Berlin + Online · 14–17 September 2026"
      crumbs={[{ label: "Programs" }, { label: "Events", to: "/events" }, { label: "Event details" }]}
      meta={<><StatusChip status="active" /><span className="text-xs text-muted-foreground">Last updated 12 minutes ago</span></>}
      actions={<><Button variant="outline">Edit</Button><Button>Share</Button></>}
      metrics={[{ label: "Registrations", value: "4,820", caption: "80% of capacity" }, { label: "Teams", value: "214" }, { label: "Submissions", value: "186" }, { label: "Revenue", value: "$182,400" }]}
      related={[{ id: "r1", label: "AI for Accessibility Track", meta: "Competition · 214 teams" }, { id: "r2", label: "Opening keynote", meta: "Schedule · Day 1, 09:00" }, { id: "r3", label: "Contoso Cloud", meta: "Sponsor · Platinum" }]}
      overview={(
        <>
          <SectionCard title="Registration trend" description="Last 7 months">
            <TrendAreaChart data={registrationTrend} xKey="month" series={[{ key: "registrations", label: "Registrations" }, { key: "participants", label: "Participants" }]} height={260} />
          </SectionCard>
          <SectionCard title="Event summary" description="Key configuration">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "Organizer", v: "Contoso Innovation Labs" },
                { k: "Mode", v: "Hybrid · Berlin + Online" },
                { k: "Dates", v: "14 – 17 September 2026" },
                { k: "Capacity", v: "6,000 participants" },
                { k: "Tracks", v: "Accessibility, Climate, Fintech" },
                { k: "Certificates", v: "Auto-issued on completion" },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{row.k}</dt>
                  <dd className="mt-1 text-sm font-medium">{row.v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        </>
      )}
    />
  );
}
