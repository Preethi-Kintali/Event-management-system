import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { useEvent, useEventSessions } from "../services/events.api";

export function EventSchedulePage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const { data: sessions = [], isLoading: isSessionsLoading } = useEventSessions(id);

  if (isEventLoading || isSessionsLoading) {
    return <div className="p-8">Loading schedule...</div>;
  }

  if (!event) {
    return <div className="p-8">Event not found</div>;
  }

  const days = Array.from(new Set(sessions.map((s) => new Date(s.startTime).toLocaleDateString())));

  return (
    <>
      <PageHeader
        title={`${event.name} schedule`}
        description={event.description || "Agenda for the event."}
        crumbs={[{ label: "Programs" }, { label: "Events", to: "/events" }, { label: "Schedule" }]}
        actions={
          <>
            <Button variant="outline">Export agenda</Button>
            <Button>Add session</Button>
          </>
        }
      />
      <div className="space-y-6">
        {days.map((day) => {
          const daySessions = sessions.filter(s => new Date(s.startTime).toLocaleDateString() === day);
          return (
            <SectionCard
              key={day}
              title={day}
              description={`${daySessions.length} sessions`}
              padded={false}
            >
              <ul className="divide-y divide-border">
                {daySessions.map((item) => (
                    <li
                      key={item.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-muted-foreground">
                          {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="mt-1 truncate text-sm font-medium">{item.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.description || "No description"}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {item.status}
                      </Badge>
                    </li>
                  ))}
              </ul>
            </SectionCard>
          );
        })}
        {days.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-md">
            No sessions scheduled yet.
          </div>
        )}
      </div>
    </>
  );
}
