import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { CommunityService } from "../services/community.service";
import { Discussion } from "../types/community.types";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquare, ThumbsUp, Bookmark, Flag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function DiscussionDetailsPage() {
  const [record, setRecord] = useState<Discussion | null>(null);
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";

  useEffect(() => {
    CommunityService.getDiscussionById(id).then((r) => setRecord(r || null));
  }, [id]);

  if (!record) return null;

  return (
    <DetailsPageTemplate
      title={record.title}
      description={`Started by ${record.author} • Last active ${record.lastActivity}`}
      crumbs={[
        { label: "Engagement" },
        { label: "Community", to: "/community" },
        { label: "Discussions", to: "/community/discussions" },
        { label: record.title },
      ]}
      meta={
        <>
          <StatusChip
            status={
              record.status === "Open"
                ? "active"
                : record.status === "Resolved"
                  ? "published"
                  : "archived"
            }
          />
          <span className="text-xs text-muted-foreground">{record.category}</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" className="text-destructive">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        </>
      }
      metrics={[
        { label: "Replies", value: record.replies.toString() },
        { label: "Views", value: record.views.toString() },
        { label: "Likes", value: record.likes.toString() },
      ]}
      overview={
        <>
          <SectionCard title="Original Post" description="">
            <div className="space-y-4">
              <p className="text-sm">
                Hello everyone! I'm looking for teammates to join me for the upcoming AI Hackathon.
                I have experience in Python and TensorFlow, but I'm looking for someone with strong
                frontend skills and maybe a UI/UX designer. Let me know if you're interested!
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsUp className="w-4 h-4 mr-1" /> Like ({record.likes})
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MessageSquare className="w-4 h-4 mr-1" /> Reply
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Join the Conversation" description="">
            <div className="space-y-4">
              <Textarea placeholder="Write a reply..." rows={4} />
              <div className="flex justify-end">
                <Button>Post Reply</Button>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}
