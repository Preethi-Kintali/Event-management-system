import { createFileRoute } from "@tanstack/react-router";
import { FinalReportPage } from "@/modules/events/pages/final-report";

export const Route = createFileRoute("/events/$id/final-report")({
  component: FinalReportPage,
});
