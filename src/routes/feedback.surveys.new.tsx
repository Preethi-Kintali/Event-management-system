import { createFileRoute } from "@tanstack/react-router";
import { SurveyCreatePage } from "@/modules/feedback/pages/survey-create";

export const Route = createFileRoute("/feedback/surveys/new")({
  head: () => ({
    meta: [{ title: "Create Survey · Ascent Platform" }],
  }),
  component: SurveyCreatePage,
});
