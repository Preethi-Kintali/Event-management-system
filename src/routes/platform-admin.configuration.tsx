import { createFileRoute } from "@tanstack/react-router";
import { ConfigurationPage } from "@/modules/platform-admin/pages/configuration";

export const Route = createFileRoute("/platform-admin/configuration")({
  head: () => ({
    meta: [{ title: "Configuration · Ascent Platform" }],
  }),
  component: ConfigurationPage,
});
