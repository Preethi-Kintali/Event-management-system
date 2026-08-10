import { createFileRoute } from "@tanstack/react-router";
import { LogsPage } from "@/modules/developer-admin/pages/logs";

export const Route = createFileRoute("/developer/logs")({
  head: () => ({
    meta: [{ title: "Application Logs · Ascent Platform" }],
  }),
  component: LogsPage,
});
