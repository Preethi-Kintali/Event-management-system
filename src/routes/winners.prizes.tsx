import { createFileRoute } from "@tanstack/react-router";
import { PrizeDistributionPage } from "@/modules/winners/pages/prizes";

export const Route = createFileRoute("/winners/prizes")({
  head: () => ({
    meta: [{ title: "Prize Distribution · Ascent Platform" }],
  }),
  component: PrizeDistributionPage,
});
