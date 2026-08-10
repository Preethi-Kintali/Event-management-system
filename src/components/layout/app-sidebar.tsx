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
    label: "Overview",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Administration",
    items: [
      { title: "Organizations", url: "/organizations", icon: Building2 },
      { title: "Users", url: "/users", icon: Users },
      { title: "Role management", url: "/roles", icon: ShieldCheck },
      { title: "Subscriptions", url: "/subscriptions", icon: Wallet },
      { title: "Audit logs", url: "/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "Programs",
    items: [
      { title: "Events", url: "/events", icon: CalendarDays },
      { title: "Event schedule", url: "/events/schedule", icon: CalendarDays },
      { title: "Competitions", url: "/competitions", icon: Trophy },
      { title: "Registrations", url: "/registrations", icon: ClipboardCheck, badge: "24" },
      { title: "Teams", url: "/teams", icon: UsersRound },
      { title: "Submissions", url: "/submissions", icon: Sparkles },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Judges", url: "/judges", icon: Gavel },
      { title: "Mentors", url: "/mentors", icon: GraduationCap },
      { title: "Volunteers", url: "/volunteers", icon: HeartHandshake },
      { title: "Sponsors", url: "/sponsors", icon: Handshake },
      { title: "Recruitment", url: "/recruitment", icon: UserRoundSearch },
    ],
  },
  {
    label: "Evaluation",
    items: [
      { title: "Evaluations", url: "/evaluations", icon: FileCheck2, badge: "88" },
      { title: "Certificates", url: "/certificates", icon: Award },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Revenue analytics", url: "/analytics/revenue", icon: BarChart3 },
      { title: "Participation", url: "/analytics/participation", icon: BarChart3 },
      { title: "Reports", url: "/reports", icon: FileBarChart },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Notifications", url: "/notifications", icon: Bell },
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
