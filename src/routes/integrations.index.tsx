import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsDashboard } from "@/modules/integrations/pages/dashboard";

export const Route = createFileRoute("/integrations/")({
  head: () => ({
    meta: [{ title: "Integration Hub · Ascent Platform" }],
  }),
  component: IntegrationsDashboard,
});
