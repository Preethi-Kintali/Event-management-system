import { createFileRoute } from "@tanstack/react-router";
import { ConnectedIntegrationsPage } from "@/modules/integrations/pages/connected";

export const Route = createFileRoute("/integrations/connected")({
  head: () => ({
    meta: [{ title: "Connected Integrations · Ascent Platform" }],
  }),
  component: ConnectedIntegrationsPage,
});
