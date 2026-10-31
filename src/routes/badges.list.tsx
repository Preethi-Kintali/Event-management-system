import { createFileRoute } from "@tanstack/react-router";
import { BadgeListPage } from "@/modules/badges/pages/badge-list";

export const Route = createFileRoute("/badges/list")({
  head: () => ({
    meta: [{ title: "Badges · Eventura Platform" }],
  }),
  component: BadgeListPage,
});
