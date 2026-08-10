import { createFileRoute } from "@tanstack/react-router";
import { ApiManagementPage } from "@/modules/developer-admin/pages/api";

export const Route = createFileRoute("/developer/api")({
  head: () => ({
    meta: [{ title: "API Management · Ascent Platform" }],
  }),
  component: ApiManagementPage,
});
