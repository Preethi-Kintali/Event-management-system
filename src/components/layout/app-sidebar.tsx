import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award, BarChart3, Bell, Building2, CalendarDays, ClipboardCheck,
  FileBarChart, FileCheck2, Gavel, GraduationCap, Handshake,
  HeartHandshake, LayoutDashboard, Settings, ShieldCheck,
  Sparkles, Trophy, UserRoundSearch, Users, UsersRound,
  Wallet, Bot, MessageSquare, BadgeAlert, Medal, Users2,
  BookOpen, MessageCircle, Cpu, Workflow, Network,
  TerminalSquare, MonitorPlay, ClipboardList, Compass
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

const orgAdminSections = [
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
      { title: "Security", url: "/security", icon: ShieldCheck },
      { title: "Developer Admin", url: "/developer", icon: TerminalSquare },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

const managerSections = [
  {
    label: "Overview",
    items: [
      { title: "Manager Dashboard", url: "/manager", icon: LayoutDashboard },
    ],
  },
  {
    label: "Managed Operations",
    items: [
      { title: "Events", url: "/manager/events", icon: CalendarDays },
      { title: "Event Revenue", url: "/manager/revenue", icon: Wallet },
      { title: "Registrations", url: "/manager/registrations", icon: ClipboardCheck },
      { title: "Transactions", url: "/manager/transactions", icon: Wallet },
      { title: "Teams", url: "/manager/teams", icon: UsersRound },
      { title: "Submissions", url: "/manager/submissions", icon: Sparkles },
      { title: "Evaluations", url: "/manager/evaluations", icon: FileCheck2 },
      { title: "Judges", url: "/manager/judges", icon: Gavel },
      { title: "Mentors", url: "/manager/mentors", icon: GraduationCap },
      { title: "Volunteers", url: "/manager/volunteers", icon: HeartHandshake },
      { title: "Attendance", url: "/manager/attendance", icon: ClipboardList },
      { title: "Certificates", url: "/manager/certificates", icon: Award },
      { title: "Reports", url: "/manager/reports", icon: FileBarChart },
    ],
  },
];

const participantSections = [
  {
    label: "My Space",
    items: [
      { title: "Dashboard", url: "/participant", icon: LayoutDashboard },
      { title: "Discover Events", url: "/participant/discover-events", icon: Compass },
    ],
  },
  {
    label: "My Activities",
    items: [
      { title: "My Registrations", url: "/participant/registrations", icon: ClipboardCheck },
      { title: "My Teams", url: "/participant/teams", icon: UsersRound },
      { title: "My Submissions", url: "/participant/submissions", icon: Sparkles },
      { title: "My Transactions", url: "/participant/transactions", icon: Wallet },
    ],
  },
  {
    label: "My Profile",
    items: [
      { title: "Certificates", url: "/participant/certificates", icon: Award },
      { title: "Achievements", url: "/participant/achievements", icon: Medal },
      { title: "Notifications", url: "/participant/notifications", icon: Bell },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string) => {
    if (url === "/" || url === "/manager" || url === "/participant") {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  const roleName = user?.memberships?.[0]?.role?.name;
  
  let sections = orgAdminSections;
  let basePath = "/";
  if (roleName === "Organization Admin" || roleName === "Manager") {
    sections = managerSections;
    basePath = "/manager";
  } else if (roleName === "Participant") {
    sections = participantSections;
    basePath = "/participant";
  } else if (roleName === "Platform Admin") {
    sections = orgAdminSections;
    basePath = "/";
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <Link to={basePath} className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="text-display block truncate text-sm font-semibold leading-tight">
                Ascent Platform
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {roleName || "Events · Competitions"}
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
                      <Link to={item.url as any} className="flex items-center gap-2.5">
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

      {!collapsed && roleName !== "Participant" && roleName !== "Manager" ? (
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
