import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/modules/community/pages/messages";

export const Route = createFileRoute("/community/messages")({
  head: () => ({
    meta: [{ title: "Direct Messages · Ascent Platform" }],
  }),
  component: MessagesPage,
});
