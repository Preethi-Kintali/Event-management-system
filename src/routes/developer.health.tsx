import { createFileRoute } from "@tanstack/react-router";
import { HealthPage } from "@/modules/developer-admin/pages/health";

export const Route = createFileRoute("/developer/health")({
  head: () => ({
    meta: [{ title: "System Health · Ascent Platform" }],
  }),
  component: HealthPage,
});
