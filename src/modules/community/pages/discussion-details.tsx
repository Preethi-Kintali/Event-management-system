import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { useDiscussion, useReplyDiscussion } from "../hooks/community.api";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquare, ThumbsUp, Bookmark, Flag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function DiscussionDetailsPage() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/").pop() || "";
  const { data: record, isLoading } = useDiscussion(id);
  const { mutate: postReply, isPending } = useReplyDiscussion();
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (!replyContent.trim()) return;
    postReply({ discussionId: id, content: replyContent }, {
      onSuccess: () => setReplyContent("")
    });
  };

  if (isLoading) return <div className="p-8">Loading discussion...</div>;
  if (!record) return <div className="p-8">Discussion not found.</div>;

  const authorName = (record as any).author ? `${(record as any).author.firstName} ${(record as any).author.lastName}` : "Unknown";
  const repliesCount = (record as any)._count?.replies || 0;

  return (
    <DetailsPageTemplate
      title={record.title}
      description={`Started by ${authorName} • Last active ${new Date(record.updatedAt).toLocaleDateString()}`}
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
              record.status === "OPEN"
                ? "active"
                : record.status === "RESOLVED"
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
        { label: "Replies", value: repliesCount.toString() },
        { label: "Views", value: record.views.toString() },
        { label: "Likes", value: record.likes.toString() },
      ]}
      overview={
        <>
          <SectionCard title="Original Post" description="">
            <div className="space-y-4">
              <p className="text-sm">
                {record.title} (Content goes here)
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

          {/* Render Replies here if any */}
          {(record as any).replies && (record as any).replies.length > 0 && (
            <SectionCard title="Replies" description="">
              <div className="space-y-4">
                {(record as any).replies.map((reply: any) => (
                  <div key={reply.id} className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm mb-2">{reply.content}</p>
                    <p className="text-xs text-muted-foreground">
                      By {reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : "Unknown"} on {new Date(reply.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Join the Conversation" description="">
            <div className="space-y-4">
              <Textarea 
                placeholder="Write a reply..." 
                rows={4} 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply} disabled={isPending || !replyContent.trim()}>
                  {isPending ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>
          </SectionCard>
        </>
      }
    />
  );
}

