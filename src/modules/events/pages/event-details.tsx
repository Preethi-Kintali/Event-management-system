import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { TrendAreaChart } from "@/components/ds/charts";
import { useParams } from "@tanstack/react-router";
import { useEvent, useEventDashboard } from "../services/events.api";

export function EventDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const { data: dashboard, isLoading: isDashboardLoading } = useEventDashboard(id);

  if (isEventLoading || isDashboardLoading) {
    return <div className="p-8">Loading event details...</div>;
  }

  if (!event) {
    return <div className="p-8">Event not found</div>;
  }

  return (
    <DetailsPageTemplate
      title={event.name}
      description={event.description || "No description provided"}
      crumbs={[
        { label: "Programs" },
        { label: "Events", to: "/events" },
        { label: "Event details" },
      ]}
      meta={
        <>
          <StatusChip status={event.status.toLowerCase() as any} />
          <span className="text-xs text-muted-foreground">
            Created on {new Date(event.createdAt).toLocaleDateString()}
          </span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit</Button>
          <Button>Share</Button>
        </>
      }
      metrics={[
        { label: "Registrations", value: dashboard?.metrics?.registrations.toLocaleString() || "0" },
        { label: "Teams", value: dashboard?.metrics?.teams.toLocaleString() || "0" },
        { label: "Submissions", value: dashboard?.metrics?.submissions.toLocaleString() || "0" },
        { label: "Revenue", value: `$${(dashboard?.metrics?.revenue || 0).toLocaleString()}` },
      ]}
      overview={
        <>
          <SectionCard title="Registration trend" description="Registrations over time">
            <TrendAreaChart
              data={dashboard?.registrationTrend || []}
              xKey="month"
              series={[
                { key: "registrations", label: "Registrations" },
                { key: "participants", label: "Participants" },
              ]}
              height={260}
            />
          </SectionCard>
          <SectionCard title="Event summary" description="Key configuration">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "Start Date", v: new Date(event.startTime).toLocaleDateString() },
                { k: "End Date", v: new Date(event.endTime).toLocaleDateString() },
                { k: "Status", v: event.status },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{row.k}</dt>
                  <dd className="mt-1 text-sm font-medium">{row.v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        </>
      }
    />
  );
}
