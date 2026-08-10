import { createFileRoute } from "@tanstack/react-router";
import { EmailGeneratorPage } from "@/modules/ai-copilot/pages/email";

export const Route = createFileRoute("/ai-copilot/email")({
  head: () => ({
    meta: [{ title: "Email Generator · Ascent Platform" }],
  }),
  component: EmailGeneratorPage,
});
