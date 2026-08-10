import { createFileRoute } from "@tanstack/react-router";
import { DevApiKeysPage } from "@/modules/developer-admin/pages/api-keys";

export const Route = createFileRoute("/developer/api-keys")({
  head: () => ({
    meta: [{ title: "System API Keys · Ascent Platform" }],
  }),
  component: DevApiKeysPage,
});
