import { createFileRoute } from "@tanstack/react-router";
import { DeveloperDashboard } from "@/modules/developer-admin/pages/dashboard";

export const Route = createFileRoute("/developer/")({
  head: () => ({
    meta: [{ title: "System Dashboard · Ascent Platform" }],
  }),
  component: DeveloperDashboard,
});
