import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scheduleItems } from "@/lib/mock-data";

const days = Array.from(new Set(scheduleItems.map((s) => s.day)));

export function EventSchedulePage() {
  return (
    <>
      <PageHeader
        title="Event schedule"
        description="Agenda for Global AI Innovation Summit 2026 across three days and four tracks."
        crumbs={[{ label: "Programs" }, { label: "Events", to: "/events" }, { label: "Schedule" }]}
        actions={
          <>
            <Button variant="outline">Export agenda</Button>
            <Button>Add session</Button>
          </>
        }
      />
      <div className="space-y-6">
        {days.map((day) => (
          <SectionCard
            key={day}
            title={day}
            description={`${scheduleItems.filter((s) => s.day === day).length} sessions`}
            padded={false}
          >
            <ul className="divide-y divide-border">
              {scheduleItems
                .filter((s) => s.day === day)
                .map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">{item.time}</p>
                      <p className="mt-1 truncate text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.track} · {item.speaker}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {item.type}
                    </Badge>
                  </li>
                ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
