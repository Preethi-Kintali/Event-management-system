import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/modules/integrations/pages/marketplace";

export const Route = createFileRoute("/integrations/marketplace")({
  head: () => ({
    meta: [{ title: "App Marketplace · Ascent Platform" }],
  }),
  component: MarketplacePage,
});
