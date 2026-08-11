import { createFileRoute } from "@tanstack/react-router";
import { LiveEventsDashboard } from "@/modules/live-events/pages/dashboard";

export const Route = createFileRoute("/live-events")({
  head: () => ({
    meta: [{ title: "Live Events · Ascent Platform" }],
  }),
  component: LiveEventsDashboard,
});
