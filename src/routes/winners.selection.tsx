import { createFileRoute } from "@tanstack/react-router";
import { WinnerSelectionPage } from "@/modules/winners/pages/selection";

export const Route = createFileRoute("/winners/selection")({
  head: () => ({
    meta: [{ title: "Winner Selection · Ascent Platform" }],
  }),
  component: WinnerSelectionPage,
});
