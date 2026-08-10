import { createFileRoute } from "@tanstack/react-router";
import { CronJobsPage } from "@/modules/developer-admin/pages/cron";

export const Route = createFileRoute("/developer/cron")({
  head: () => ({
    meta: [{ title: "Cron Jobs · Ascent Platform" }],
  }),
  component: CronJobsPage,
});
