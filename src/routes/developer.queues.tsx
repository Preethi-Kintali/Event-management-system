import { createFileRoute } from "@tanstack/react-router";
import { QueuesPage } from "@/modules/developer-admin/pages/queues";

export const Route = createFileRoute("/developer/queues")({
  head: () => ({
    meta: [{ title: "Queue Management · Ascent Platform" }],
  }),
  component: QueuesPage,
});
