import { createFileRoute } from "@tanstack/react-router";
import { SecurityDashboard } from "@/modules/security/pages/dashboard";

export const Route = createFileRoute("/security/")({
  head: () => ({
    meta: [{ title: "Security Dashboard · Ascent Platform" }],
  }),
  component: SecurityDashboard,
});
