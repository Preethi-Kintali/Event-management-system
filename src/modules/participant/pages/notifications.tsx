import { ListPageTemplate } from "@/components/templates/list-page";
import { useMyNotifications } from "../hooks/participant.api";

export function ParticipantNotificationsPage() {
  const { data = [], isLoading } = useMyNotifications();

  return (
    <ListPageTemplate<any>
      title="My Notifications"
      description="View your notifications."
      crumbs={[{ label: "Participant" }, { label: "Notifications" }]}
      columns={[
        { key: "message", header: "Message", render: (row) => <span className={row.readAt ? "text-muted-foreground" : "font-medium"}>{row.message || 'Notification'}</span> },
        { key: "type", header: "Type", render: (row) => <span>{row.type || 'INFO'}</span> },
        { key: "createdAt", header: "Date", render: (row) => <span>{new Date(row.createdAt).toLocaleString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["message", "type"]}
    />
  );
}
