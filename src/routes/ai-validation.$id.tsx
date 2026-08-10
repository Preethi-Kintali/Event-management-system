import { createFileRoute } from "@tanstack/react-router";
import { ValidationDetailsPage } from "@/modules/ai-validation/pages/validation-details";

export const Route = createFileRoute("/ai-validation/$id")({
  head: () => ({
    meta: [{ title: "Validation Details · Ascent Platform" }],
  }),
  component: ValidationDetailsPage,
});
