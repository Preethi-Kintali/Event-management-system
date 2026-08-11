import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionsPage } from "@/modules/platform-admin/pages/subscriptions";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [{ title: "Subscriptions · Ascent Platform" }],
  }),
  component: SubscriptionsPage,
});
