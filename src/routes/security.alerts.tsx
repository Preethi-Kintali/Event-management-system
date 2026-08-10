import { createFileRoute } from "@tanstack/react-router";
import { AlertsPage } from "@/modules/security/pages/alerts";

export const Route = createFileRoute("/security/alerts")({
  head: () => ({
    meta: [{ title: "Security Alerts · Ascent Platform" }],
  }),
  component: AlertsPage,
});
