import { createFileRoute } from "@tanstack/react-router";
import { BadgesDashboard } from "@/modules/badges/pages/dashboard";

export const Route = createFileRoute("/badges/")({
  head: () => ({
    meta: [{ title: "Badges & Achievements · Eventura Platform" }],
  }),
  component: BadgesDashboard,
});
