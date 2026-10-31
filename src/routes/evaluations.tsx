import { createFileRoute } from "@tanstack/react-router";
import { EvaluationsPage } from "@/modules/evaluations/pages/evaluations-page";

export const Route = createFileRoute("/evaluations")({
  head: () => ({
    meta: [
      { title: "Evaluations · Eventura Platform" },
      {
        name: "description",
        content: "Judge workspace with assignment queue, scorecards and calibration insights.",
      },
      { property: "og:title", content: "Evaluations · Eventura Platform" },
      {
        property: "og:description",
        content: "Judge workspace with assignment queue, scorecards and calibration insights.",
      },
    ],
  }),
  component: EvaluationsPage,
});
