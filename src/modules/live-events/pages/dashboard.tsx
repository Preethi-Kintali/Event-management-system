import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { LiveEventsService } from "../services/live-events.service";
import {
  LiveEvent,
  LiveAnnouncement,
  LivePoll,
  LiveQuestion,
  LeaderboardEntry,
} from "../types/live-events.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  Users,
  Heart,
  MessageSquare,
  Trophy,
  Clock,
  Send,
  ThumbsUp,
} from "lucide-react";

export function LiveEventsDashboard() {
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [announcements, setAnnouncements] = useState<LiveAnnouncement[]>([]);
  const [polls, setPolls] = useState<LivePoll[]>([]);
  const [questions, setQuestions] = useState<LiveQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    LiveEventsService.getCurrentEvent().then(setEvent);
    LiveEventsService.getAnnouncements().then(setAnnouncements);
    LiveEventsService.getActivePolls().then(setPolls);
    LiveEventsService.getQuestions().then(setQuestions);
    LiveEventsService.getLeaderboard().then(setLeaderboard);
  }, []);

  if (!event) return null;

  return (
    <>
      <PageHeader
        title={event.title}
        description="Manage the live streaming experience and audience interaction."
        crumbs={[{ label: "Event Operations" }, { label: "Live Events" }]}
        actions={
          <Button variant={event.status === "Live" ? "destructive" : "default"}>
            {event.status === "Live" ? "End Livestream" : "Go Live"}
          </Button>
        }
      />

      <div className="grid gap-6 mt-6 xl:grid-cols-3">
        {/* Main Stream Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-border group flex items-center justify-center">
            {event.isStreaming ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-mono text-sm">STREAMING ACTIVE • {event.streamUrl}</p>
              </div>
            ) : (
              <p className="text-muted-foreground font-mono">Stream is currently offline.</p>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="destructive" className="animate-pulse flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div> LIVE
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/50 text-white backdrop-blur flex items-center gap-1.5 border-white/10"
              >
                <Users className="w-3.5 h-3.5" /> {event.viewers.toLocaleString()}
              </Badge>
            </div>

            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 text-white backdrop-blur hover:bg-black/70 border-white/10"
              >
                <Heart className="w-4 h-4 mr-1.5 text-rose-500 fill-rose-500" />{" "}
                {event.likes.toLocaleString()}
              </Button>
            </div>
          </div>

          <SectionCard
            title="Live Polls"
            description="Engage your audience with real-time questions"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                return (
                  <div key={poll.id} className="p-4 border border-border rounded-lg bg-surface">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-sm leading-snug pr-2">{poll.question}</h4>
                      <Badge
                        variant={poll.status === "Open" ? "default" : "secondary"}
                        className="text-[10px] uppercase"
                      >
                        {poll.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {poll.options.map((opt, i) => {
                        const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{opt.label}</span>
                              <span className="text-muted-foreground">{Math.round(pct)}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                      <span>{totalVotes} total votes</span>
                      {poll.status === "Open" ? (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Close Poll
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Publish Results
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Audience Q&A" description="Questions submitted by attendees">
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 border border-border rounded-lg bg-surface flex gap-4 items-start"
                >
                  <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-xs font-semibold">{q.upvotes}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{q.author}</span>
                      <span className="text-[10px] text-muted-foreground">{q.timestamp}</span>
                    </div>
                    <p className="text-sm mb-3">{q.question}</p>
                    <div className="flex gap-2">
                      {q.isAnswered ? (
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                          Answered
                        </Badge>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Mark as Answered
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Show on Stream
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <SectionCard title="Session Status" description="Timing and schedule">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Elapsed Time</div>
                <div className="text-2xl font-bold tabular-nums">02:45:12</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Started: 10:00 AM</span>
                <span className="text-muted-foreground">Ends: 06:00 PM</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
          </SectionCard>

          <SectionCard title="Announcements" description="Broadcast to all attendees">
            <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-muted/40 rounded-lg border border-border/50 text-sm"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-medium text-xs text-primary">{a.author}</span>
                    <span className="text-[10px] text-muted-foreground">{a.timestamp}</span>
                  </div>
                  <p className="text-foreground/90">{a.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 relative">
              <Input placeholder="Type announcement..." className="pr-10" />
              <Button size="icon" className="absolute right-1 top-1 h-8 w-8">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Live Leaderboard" description="Top engaged attendees">
            <div className="space-y-3">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-yellow-500/20 text-yellow-600"
                          : i === 1
                            ? "bg-slate-300/30 text-slate-500"
                            : i === 2
                              ? "bg-amber-600/20 text-amber-700"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < 3 ? <Trophy className="w-3.5 h-3.5" /> : entry.rank}
                    </div>
                    <span className="text-sm font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm tabular-nums font-semibold">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
