import { DetailsPageTemplate } from "@/components/templates/details-page";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { TrendAreaChart } from "@/components/ds/charts";
import { useParams } from "@tanstack/react-router";
import { useEvent, useEventDashboard, useExecutionSummary, useCompleteEvent } from "../services/events.api";
import { toast } from "sonner";
import { ShieldCheck, Users, Trophy, HeartHandshake } from "lucide-react";
import { EventTeamList } from "../components/event-team-list";
import { AdminExecutionDataTool } from "../components/admin-execution-data-tool";
import { useFinalReport } from "../services/final-report.api";
import { useUpdateEvent } from "../services/events.api";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { EventAssignment } from "../components/event-assignment";
import { EventRegistrationsList } from "../components/event-registrations-list";

export function EventDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const { data: dashboard, isLoading: isDashboardLoading } = useEventDashboard(id);
  
  // Execution Summary hooks
  const { data: executionSummary, isLoading: isExecutionLoading } = useExecutionSummary(id);
  const completeEvent = useCompleteEvent();
  const navigate = useNavigate();

  // Final Report Hooks
  const { data: finalReport, isLoading: isReportLoading } = useFinalReport(id);
  const updateEvent = useUpdateEvent();
  const { hasPermission } = useAuth();

  const handleCompleteEvent = async () => {
    if (confirm("Are you sure you want to mark this event as completed?\nAfter completion, the event will move to the final reporting stage.")) {
      try {
        await completeEvent.mutateAsync(id);
        toast.success("Event successfully completed and data locked for reporting.");
      } catch (err: any) {
        toast.error(err.message || "Failed to complete event");
      }
    }
  };

  const handlePublishEvent = async () => {
    try {
      await updateEvent.mutateAsync({ id, status: "LIVE" });
      toast.success("Event is now LIVE!");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish event");
    }
  };


  if (isEventLoading || isDashboardLoading || isExecutionLoading) {
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
          {(event.status === "DRAFT" || event.status === "PUBLISHED") && hasPermission("events.update") && (
            <Button variant="outline" onClick={handlePublishEvent} disabled={updateEvent.isPending}>
              {updateEvent.isPending ? "Publishing..." : "Publish to LIVE"}
            </Button>
          )}
          {event.status === "LIVE" && hasPermission("events.complete") && (
            <Button variant="default" onClick={handleCompleteEvent} disabled={completeEvent.isPending}>
              {completeEvent.isPending ? "Completing..." : "Mark Event as Completed"}
            </Button>
          )}
          {event.status === "COMPLETED" && (hasPermission("events.read") || hasPermission("reports.create_assigned")) && (
            <Button variant="default" onClick={() => navigate({ to: `/events/${id}/final-report` })}>
              {finalReport ? "View Final Report" : "Create Final Report"}
            </Button>
          )}
          {hasPermission("events.update") && <Button variant="outline">Edit</Button>}
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

          {executionSummary && (event.status === "LIVE" || event.status === "COMPLETED") && (
            <SectionCard title="Execution Summary" description="Live analytics and final statistics">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-surface border rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-sm">Participants</span>
                  </div>
                  <div className="text-2xl font-bold">{executionSummary.registrations.totalRegistered} <span className="text-sm font-normal text-muted-foreground">Registered</span></div>
                  <div className="text-sm mt-1">{executionSummary.attendance.uniqueAttendees} Actual Attendees ({executionSummary.attendance.attendancePercentage}%)</div>
                </div>
                
                <div className="p-4 bg-surface border rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold text-sm">Competition</span>
                  </div>
                  <div className="text-2xl font-bold">{executionSummary.competition.totalTeams} <span className="text-sm font-normal text-muted-foreground">Teams</span></div>
                  <div className="text-sm mt-1">{executionSummary.competition.totalSubmissions} Submissions, {executionSummary.competition.totalWinners} Winners</div>
                </div>

                <div className="p-4 bg-surface border rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="font-semibold text-sm">Volunteers</span>
                  </div>
                  <div className="text-2xl font-bold">{executionSummary.volunteers.totalVolunteers} <span className="text-sm font-normal text-muted-foreground">Staff</span></div>
                  <div className="text-sm mt-1">{executionSummary.volunteers.totalVolunteerHours} Total Hours Logged</div>
                </div>
              </div>
            </SectionCard>
          )}
          
          {event.rules && (
            <SectionCard title="Rules & Guidelines" description="Event instructions and eligibility">
              <div className="text-sm whitespace-pre-wrap text-muted-foreground bg-surface p-4 rounded-lg border border-border">
                {event.rules}
              </div>
            </SectionCard>
          )}

          {hasPermission("events.assign_coordinator") || hasPermission("reports.create_assigned") ? (
            <EventAssignment eventId={id} />
          ) : null}

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
      customTabs={[
        { value: "registrations", label: "Registrations" },
        { value: "team", label: "Team" },
        ...(hasPermission("events.update") ? [{ value: "execution", label: "Admin Data Injection" }] : [])
      ]}
      customTabContents={[
        { value: "registrations", content: <EventRegistrationsList eventId={id} /> },
        { value: "team", content: <EventTeamList eventId={id} /> },
        ...(hasPermission("events.update") ? [{ value: "execution", content: <AdminExecutionDataTool eventId={id} /> }] : [])
      ]}
    />
  );
}
