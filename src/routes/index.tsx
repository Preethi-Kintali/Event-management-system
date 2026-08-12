import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CalendarDays,
  ClipboardCheck,
  FileCheck2,
  Plus,
  Trophy,
  Wallet,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { StatCard } from "@/components/ds/stat-card";
import { DonutChart, GroupedBarChart, TrendAreaChart } from "@/components/ds/charts";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  activities,
  categoryMix,
  deadlines,
  events,
  submissions,
} from "@/lib/mock-data";
import { registrationTrend, evaluationLoad } from "@/lib/mock-analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Ascent Event & Innovation Platform" },
      {
        name: "description",
        content:
          "Enterprise dashboard for events, competitions, registrations, evaluations and certificates.",
      },
      { property: "og:title", content: "Dashboard · Ascent Event & Innovation Platform" },
      {
        property: "og:description",
        content:
          "Track events, competitions, registrations, revenue and evaluations in one console.",
      },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Total events", value: "486", delta: 8.9, hint: "vs last year", icon: CalendarDays },
  {
    label: "Active competitions",
    value: "64",
    delta: 5.2,
    hint: "12 closing this week",
    icon: Trophy,
  },
  {
    label: "Registrations",
    value: "42,800",
    delta: 14.6,
    hint: "this cycle",
    icon: ClipboardCheck,
  },
  { label: "Revenue (MTD)", value: "$108,600", delta: 12.4, hint: "vs last month", icon: Wallet },
  { label: "Certificates issued", value: "18,420", delta: 24.1, icon: Award },
  {
    label: "Pending evaluations",
    value: "88",
    delta: -6.4,
    hint: "SLA 48 hours",
    icon: FileCheck2,
  },
  { label: "Capacity filled", value: "81%", progress: 81, icon: CalendarDays },
  { label: "Upcoming events", value: "17", hint: "next 30 days", icon: CalendarDays },
];

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Platform dashboard"
        description="Operational overview across every organization, event and competition."
        crumbs={[{ label: "Overview" }, { label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/reports">View reports</Link>
            </Button>
            <Button asChild>
              <Link to="/events/new">
                <Plus className="h-4 w-4" />
                Create event
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Registrations & participation"
            description="Last 7 months"
            actions={<Badge variant="secondary">Live</Badge>}
          >
            <TrendAreaChart
              data={registrationTrend}
              xKey="month"
              series={[
                { key: "registrations", label: "Registrations" },
                { key: "participants", label: "Participants" },
              ]}
            />
          </SectionCard>
        </div>
        <SectionCard title="Event category mix" description="Share of active programs">
          <DonutChart data={categoryMix} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Upcoming events"
            description="Next scheduled programs"
            actions={
              <Button size="sm" variant="ghost" asChild>
                <Link to="/events">View all</Link>
              </Button>
            }
            padded={false}
          >
            <ul className="divide-y divide-border">
              {events.slice(0, 5).map((event) => (
                <li
                  key={event.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{event.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {event.org} · {event.mode} · {event.start}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
                      {event.registrations.toLocaleString()} registered
                    </span>
                    <StatusChip status={event.status} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <SectionCard title="Quick actions" description="Common operator tasks">
          <div className="grid gap-2">
            {[
              { label: "Create event", to: "/events/new" },
              { label: "Review registrations", to: "/registrations" },
              { label: "Open evaluation queue", to: "/evaluations" },
              { label: "Generate certificates", to: "/certificates" },
              { label: "Invite judges", to: "/judges" },
            ].map((action) => (
              <Button key={action.to} variant="outline" className="justify-start" asChild>
                <Link to={action.to}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Evaluation load" description="Pending vs completed">
          <GroupedBarChart
            data={evaluationLoad}
            xKey="round"
            series={[
              { key: "completed", label: "Completed" },
              { key: "pending", label: "Pending" },
            ]}
            stacked
            height={240}
          />
        </SectionCard>

        <SectionCard title="Upcoming deadlines" description="Across active programs">
          <ul className="space-y-4">
            {deadlines.map((deadline) => (
              <li key={deadline.id}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                  <p className="truncate text-sm font-medium">{deadline.title}</p>
                  <span
                    className={
                      deadline.severity === "error"
                        ? "shrink-0 text-xs font-medium text-destructive"
                        : "shrink-0 text-xs text-muted-foreground"
                    }
                  >
                    {deadline.due}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{deadline.event}</p>
                <Progress value={deadline.progress} className="mt-2 h-1.5" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent activity" description="Last 24 hours">
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary-muted text-[11px] font-semibold text-accent-foreground">
                    {activity.actor
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{activity.actor}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
