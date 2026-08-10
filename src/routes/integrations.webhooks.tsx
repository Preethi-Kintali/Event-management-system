import { createFileRoute } from "@tanstack/react-router";
import { WebhooksPage } from "@/modules/integrations/pages/webhooks";

export const Route = createFileRoute("/integrations/webhooks")({
  head: () => ({
    meta: [{ title: "Webhooks · Ascent Platform" }],
  }),
  component: WebhooksPage,
});
