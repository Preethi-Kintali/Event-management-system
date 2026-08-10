import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { CommunityService } from "../services/community.service";
import { Connection } from "../types/community.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function NetworkingPage() {
  const [recommendations, setRecommendations] = useState<Connection[]>([]);

  useEffect(() => {
    CommunityService.getNetworkingRecommendations().then(setRecommendations);
  }, []);

  return (
    <>
      <PageHeader
        title="Networking Recommendations"
        description="AI-driven match-making based on shared skills and event history."
        crumbs={[
          { label: "Engagement" },
          { label: "Community", to: "/community" },
          { label: "Networking" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((conn) => (
          <SectionCard key={conn.id} title="" description="" className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${conn.name}`}
                  />
                  <AvatarFallback>{conn.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{conn.name}</p>
                  <p className="text-xs text-muted-foreground">{conn.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {conn.matchScore}% Match
                </div>
                <Progress value={conn.matchScore} className="w-16 h-1.5 mt-1" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
                  Shared Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {conn.sharedSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
                  Common Interests
                </p>
                <div className="flex flex-wrap gap-1">
                  {conn.sharedInterests.map((i) => (
                    <Badge key={i} variant="outline" className="font-normal text-[10px]">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {conn.mutualConnections} mutual connections
              </p>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-1.5" />
                Connect
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
