import { createFileRoute } from "@tanstack/react-router";
import { CampaignCreatePage } from "@/modules/communication/pages/campaign-create";

export const Route = createFileRoute("/communication/campaigns/new")({
  head: () => ({
    meta: [{ title: "New Campaign · Eventura Platform" }],
  }),
  component: CampaignCreatePage,
});
