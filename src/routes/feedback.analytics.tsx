import { createFileRoute } from "@tanstack/react-router";
import { FeedbackAnalyticsPage } from "@/modules/feedback/pages/analytics";

export const Route = createFileRoute("/feedback/analytics")({
  head: () => ({
    meta: [{ title: "Feedback Analytics · Ascent Platform" }],
  }),
  component: FeedbackAnalyticsPage,
});
