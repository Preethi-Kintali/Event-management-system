import { createFileRoute } from "@tanstack/react-router";
import { ReportGeneratorPage } from "@/modules/ai-copilot/pages/reports";

export const Route = createFileRoute("/ai-copilot/reports")({
  head: () => ({
    meta: [{ title: "Report Generator · Ascent Platform" }],
  }),
  component: ReportGeneratorPage,
});
