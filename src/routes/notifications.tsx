import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import { SeverityChip } from "@/components/ds/status-chip";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Ascent Platform" },
      {
        name: "description",
        content: "Platform alerts, approvals and operational notices in one inbox.",
      },
      { property: "og:title", content: "Notifications · Ascent Platform" },
      {
        property: "og:description",
        content: "Platform alerts, approvals and operational notices in one inbox.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Approvals, deadlines and system alerts across your organizations."
        crumbs={[{ label: "Workspace" }, { label: "Notifications" }]}
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("All notifications marked as read")}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />
      <SectionCard
        title="Inbox"
        description={`${notifications.filter((n) => n.unread).length} unread`}
        padded={false}
      >
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {n.time}
                </p>
              </div>
              <SeverityChip severity={n.type} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
