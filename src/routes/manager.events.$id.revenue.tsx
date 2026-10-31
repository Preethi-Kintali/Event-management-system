import { createFileRoute } from "@tanstack/react-router";
import { ManagerEventRevenuePage } from "@/modules/manager/pages/event-revenue";

export const Route = createFileRoute("/manager/events/$id/revenue")({
  head: () => ({
    meta: [{ title: "Event Revenue · Manager · Eventura Platform" }],
  }),
  component: ManagerEventRevenuePage,
});
