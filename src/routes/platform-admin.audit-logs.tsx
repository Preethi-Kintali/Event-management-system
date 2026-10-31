import { createFileRoute } from "@tanstack/react-router";
import { AuditLogsPage } from "@/modules/platform-admin/pages/audit-logs";

export const Route = createFileRoute("/platform-admin/audit-logs")({
  head: () => ({
    meta: [{ title: "Audit Logs · Eventura Platform" }],
  }),
  component: AuditLogsPage,
});
