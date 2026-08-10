import { createFileRoute } from "@tanstack/react-router";
import { CommunicationTemplatesPage } from "@/modules/communication/pages/templates";

export const Route = createFileRoute("/communication/templates")({
  head: () => ({
    meta: [{ title: "Templates · Ascent Platform" }],
  }),
  component: CommunicationTemplatesPage,
});
