import { createFileRoute } from "@tanstack/react-router";
import { SubmissionDetailsPage } from "@/modules/submissions/pages/submission-details";

export const Route = createFileRoute("/submissions/$id")({
  head: () => ({
    meta: [
      { title: "SUB-2291 · SignBridge · Ascent Platform" },
      { name: "description", content: "Realtime sign language captions · Neural Nomads · Round 2" },
      { property: "og:title", content: "SUB-2291 · SignBridge · Ascent Platform" },
      {
        property: "og:description",
        content: "Realtime sign language captions · Neural Nomads · Round 2",
      },
    ],
  }),
  component: SubmissionDetailsPage,
});
