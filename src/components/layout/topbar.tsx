import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronsUpDown,
  CircleHelp,
  Command as CommandIcon,
  LogOut,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SeverityChip } from "@/components/ds/status-chip";

import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, Notification } from "@/modules/communication/services/notifications.api";
import { CheckCheck, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const quickLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Create event", to: "/events/new" },
  { label: "Competitions", to: "/competitions" },
  { label: "Registrations", to: "/registrations" },
  { label: "Submissions", to: "/submissions" },
  { label: "Evaluations", to: "/evaluations" },
  { label: "Certificates", to: "/certificates" },
  { label: "Revenue analytics", to: "/analytics/revenue" },
  { label: "Settings", to: "/settings" },
];

export function Topbar() {
  const { user, logout, activeOrganization, setActiveOrganization } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: notificationsData } = useNotifications(1, 10);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  
  const notifications = notificationsData?.data || [];
  const unread = notificationsData?.unreadCount || 0;

  const currentMembership = user?.memberships?.find(
    (m) => m.organization.id === activeOrganization
  );
  const orgName = currentMembership?.organization.name || "Ascent Platform";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-surface/70 sm:px-4">
      <SidebarTrigger className="min-h-9 min-w-9" />
      <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hidden max-w-56 gap-2 px-2 md:inline-flex">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-primary-muted text-[11px] font-semibold text-accent-foreground">
              {orgName.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 truncate text-sm">{orgName}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Switch organization
          </DropdownMenuLabel>
          {user?.memberships?.map((m) => (
            <DropdownMenuItem 
              key={m.organization.id} 
              onSelect={() => setActiveOrganization(m.organization.id)} 
              className="gap-2"
            >
              <span className="min-w-0 flex-1 truncate">{m.organization.name}</span>
              {m.organization.id === activeOrganization ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/organizations">Manage organizations</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-foreground md:ml-2 md:w-full md:max-w-md md:justify-start md:gap-2 md:px-3"
        aria-label="Open global search"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden truncate text-sm md:inline">
          Search events, teams, submissions…
        </span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex">
          <CommandIcon className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-0.5 md:ml-0">
        <Button
          variant="ghost"
          size="icon"
          className="hidden min-h-9 min-w-9 text-muted-foreground sm:inline-flex"
          aria-label="Help and support"
        >
          <CircleHelp className="h-[1.1rem] w-[1.1rem]" />
        </Button>
        <ThemeToggle />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative min-h-9 min-w-9 text-muted-foreground"
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell className="h-[1.1rem] w-[1.1rem]" />
              {unread ? (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="mb-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Notifications</SheetTitle>
                {unread > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => markAllAsRead.mutate()} className="h-8 gap-1.5 text-xs">
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all as read
                  </Button>
                )}
              </div>
              <SheetDescription>{unread} unread across your organizations</SheetDescription>
            </SheetHeader>
            <ul className="space-y-2 overflow-y-auto pb-4 scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No notifications.</div>
              ) : (
                notifications.map((n: Notification) => (
                  <li
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markAsRead.mutate(n.id);
                      if (n.link) navigate({ to: n.link });
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/40 ${n.isRead ? "border-transparent bg-transparent" : "border-border bg-surface"}`}
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className={`text-sm leading-snug ${n.isRead ? "text-muted-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                      <SeverityChip severity={n.type === "CERTIFICATE" ? "success" : n.type === "ANNOUNCEMENT" ? "info" : "warning"} />
                    </div>
                    <p className={`mt-1 text-sm ${n.isRead ? "text-muted-foreground/70" : "text-muted-foreground"}`}>{n.message}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-1 h-9 gap-2 px-1.5">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary-muted text-[11px] font-semibold text-accent-foreground">
                  {user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 text-left lg:block">
                <span className="block truncate text-xs font-medium leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {user?.status || "Active"}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : ""}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                Workspace settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a module, event or record…" />
        <CommandList>
          <CommandEmpty>No matches found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {quickLinks.map((link) => (
              <CommandItem
                key={link.to}
                onSelect={() => {
                  setOpen(false);
                  void navigate({ to: link.to });
                }}
              >
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Recent records">
            <CommandItem onSelect={() => setOpen(false)}>SUB-2291 · SignBridge</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Team · Neural Nomads</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Event · Global AI Innovation Summit 2026
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
