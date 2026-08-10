import { createFileRoute } from "@tanstack/react-router";
import { IntegrationDetailsPage } from "@/modules/integrations/pages/integration-details";

export const Route = createFileRoute("/integrations/$id")({
  head: () => ({
    meta: [{ title: "Integration Details · Ascent Platform" }],
  }),
  component: IntegrationDetailsPage,
});
