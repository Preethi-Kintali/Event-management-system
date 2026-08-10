import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileBarChart,
  FileCheck2,
  Gavel,
  GraduationCap,
  Handshake,
  HeartHandshake,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundSearch,
  Users,
  UsersRound,
  Wallet,
  Bot,
  MessageSquare,
  BadgeAlert,
  Medal,
  Users2,
  BookOpen,
  MessageCircle,
  Cpu,
  Workflow,
  Network,
  TerminalSquare,
  MonitorPlay,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    label: "Platform",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Platform Administration", url: "/platform-admin", icon: Settings },
      { title: "Organizations", url: "/organizations", icon: Building2 },
      { title: "Users", url: "/users", icon: Users },
      { title: "Roles & Permissions", url: "/roles", icon: ShieldCheck },
    ],
  },
  {
    label: "Event Operations",
    items: [
      { title: "Events", url: "/events", icon: CalendarDays },
      { title: "Competitions", url: "/competitions", icon: Trophy },
      { title: "Registrations", url: "/registrations", icon: ClipboardCheck, badge: "24" },
      { title: "Teams", url: "/teams", icon: UsersRound },
      { title: "Submissions", url: "/submissions", icon: Sparkles },
      { title: "Evaluation", url: "/evaluations", icon: FileCheck2, badge: "88" },
      { title: "Judges", url: "/judges", icon: Gavel },
      { title: "Mentors", url: "/mentors", icon: GraduationCap },
      { title: "Volunteers", url: "/volunteers", icon: HeartHandshake },
      { title: "Attendance", url: "/attendance", icon: ClipboardList },
      { title: "Live Events", url: "/live-events", icon: MonitorPlay },
    ],
  },
  {
    label: "Engagement",
    items: [
      { title: "Communication", url: "/communication", icon: MessageSquare },
      { title: "Certificates", url: "/certificates", icon: Award },
      { title: "Badges", url: "/badges", icon: BadgeAlert },
      { title: "Winners", url: "/winners", icon: Medal },
      { title: "Sponsors", url: "/sponsors", icon: Handshake },
      { title: "Community", url: "/community", icon: Users2 },
      { title: "Learning", url: "/learning", icon: BookOpen },
      { title: "Feedback", url: "/feedback", icon: MessageCircle },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Payments", url: "/subscriptions", icon: Wallet },
      { title: "Recruitment", url: "/recruitment", icon: UserRoundSearch },
      { title: "Analytics", url: "/analytics/revenue", icon: BarChart3 },
      { title: "Reports", url: "/reports", icon: FileBarChart },
    ],
  },
  {
    label: "AI & Automation",
    items: [
      { title: "AI Validation", url: "/ai-validation", icon: Cpu },
      { title: "AI Copilot", url: "/ai-copilot", icon: Bot },
      { title: "Workflows", url: "/workflows", icon: Workflow },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Integrations", url: "/integrations", icon: Network },
      { title: "Security", url: "/audit-logs", icon: ScrollText },
      { title: "Developer Administration", url: "/developer-admin", icon: TerminalSquare },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname === url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="text-display block truncate text-sm font-semibold leading-tight">
                Ascent Platform
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Events · Competitions · Innovation
              </span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed ? (
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wide">
                {section.label}
              </SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed ? (
                          <>
                            <span className="min-w-0 flex-1 truncate">{item.title}</span>
                            {"badge" in item && item.badge ? (
                              <Badge
                                variant="secondary"
                                className="h-5 shrink-0 px-1.5 text-[10px] tabular-nums"
                              >
                                {item.badge}
                              </Badge>
                            ) : null}
                          </>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {!collapsed ? (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/60 p-3">
            <p className="text-xs font-medium">Enterprise trial</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              21 days left · 4,820 of 5,000 seats used
            </p>
          </div>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
