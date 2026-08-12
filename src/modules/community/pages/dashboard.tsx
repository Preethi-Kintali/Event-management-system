import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { useGroups, useDiscussions, useCommunityDashboard } from "../hooks/community.api";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Users2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CommunityDashboard() {
  const { data: groups = [], isLoading: loadingGroups } = useGroups();
  const { data: discussions = [], isLoading: loadingDiscussions } = useDiscussions();
  const { data: stats, isLoading: loadingStats } = useCommunityDashboard();

  return (
    <>
      <PageHeader
        title="Community & Networking"
        description="Fostering connections, discussions, and specialized groups."
        crumbs={[{ label: "Engagement" }, { label: "Community" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Members"
          value={stats?.members?.toString() || "0"}
          delta={12.4}
          index={0}
        />
        <StatCard label="Active Groups" value={stats?.groups?.toString() || "0"} index={1} />
        <StatCard label="Discussions" value={stats?.discussions?.toString() || "0"} index={2} />
        <StatCard label="Active Discussions" value={stats?.activeDiscussions?.toString() || "0"} index={3} />
        <StatCard label="Replies / Disc" value={stats?.engagementRate?.toString() || "0"} index={4} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <SectionCard title="Trending Discussions" description="Highest engagement in the last 24h">
          {loadingDiscussions ? (
            <div className="p-4">Loading discussions...</div>
          ) : (
            <div className="grid gap-4">
              {discussions.slice(0, 3).map((disc: any) => (
                <div
                  key={disc.id}
                  className="flex items-start gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        to={`/community/discussions/${disc.id}` as any}
                        className="font-semibold hover:underline"
                      >
                        {disc.title}
                      </Link>
                      <Badge variant="secondary">{disc.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {disc.author ? `${disc.author.firstName} ${disc.author.lastName}` : "Unknown"} • {new Date(disc.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>💬 {disc._count?.replies || 0} Replies</span>
                      <span>👁️ {disc.views || 0} Views</span>
                      <span>❤️ {disc.likes || 0} Likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/community/discussions">View All Discussions</Link>
          </Button>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Popular Groups" description="Most active communities">
            {loadingGroups ? (
              <div className="p-4">Loading groups...</div>
            ) : (
              <ul className="divide-y divide-border">
                {groups.slice(0, 3).map((group: any) => (
                  <li key={group.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <Users2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.category} • {group._count?.members || 0} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Medium Activity</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <div className="grid grid-cols-2 gap-4">
            <SectionCard title="Direct Messages" description="Pending" padded={true}>
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <span className="text-3xl font-bold">14</span>
                <Button variant="link" size="sm" asChild>
                  <Link to="/community/messages">Open Inbox</Link>
                </Button>
              </div>
            </SectionCard>
            <SectionCard title="New Connections" description="This week" padded={true}>
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <span className="text-3xl font-bold">28</span>
                <Button variant="link" size="sm" asChild>
                  <Link to="/community/networking">Find Matches</Link>
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}

