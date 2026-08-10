import { createFileRoute } from "@tanstack/react-router";
import { ApiKeysPage } from "@/modules/integrations/pages/api-keys";

export const Route = createFileRoute("/integrations/api-keys")({
  head: () => ({
    meta: [{ title: "API Keys · Ascent Platform" }],
  }),
  component: ApiKeysPage,
});
