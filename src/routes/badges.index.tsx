import { createFileRoute } from "@tanstack/react-router";
import { BadgesDashboard } from "@/modules/badges/pages/dashboard";

export const Route = createFileRoute("/badges/")({
  head: () => ({
    meta: [{ title: "Badges & Achievements · Ascent Platform" }],
  }),
  component: BadgesDashboard,
});
