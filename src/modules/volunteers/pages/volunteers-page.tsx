import { Loader2 } from "lucide-react";
import { StatCard } from "@/components/ds/stat-card";
import { ListPageTemplate } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/components/ds/data-table";
import { useVolunteers, ApiVolunteer } from "../services/volunteers.api";

type VolunteerRow = ApiVolunteer & {
  _name: string;
  _email: string;
  _shifts: number;
  _hours: number;
  _events: number;
};

const columns: Column<VolunteerRow>[] = [
  {
    key: "_name" as any,
    header: "Volunteer",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium">{row._name}</p>
        <p className="text-xs text-muted-foreground">{row._email}</p>
      </div>
    ),
  },
  {
    key: "role" as any,
    header: "Role",
    sortable: true,
    render: (row) =>
      row.role ? (
        <Badge variant="outline">{row.role}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "_events" as any,
    header: "Events",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._events}</span>,
  },
  {
    key: "_shifts" as any,
    header: "Shifts",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._shifts}</span>,
  },
  {
    key: "_hours" as any,
    header: "Hours",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._hours.toFixed(1)}</span>,
  },
  {
    key: "createdAt" as any,
    header: "Registered",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

export function VolunteersPage() {
  const { data: volunteers = [], isLoading, error } = useVolunteers();

  const rows: VolunteerRow[] = volunteers.map((v) => ({
    ...v,
    _name:
      v.user
        ? `${v.user.firstName ?? ""} ${v.user.lastName ?? ""}`.trim() || v.user.email
        : v.userId,
    _email: v.user?.email ?? "—",
    _events: v.eventAssignments?.length ?? 0,
    _shifts: v.eventAssignments?.reduce((s, a) => s + a.shiftsCount, 0) ?? 0,
    _hours: v.eventAssignments?.reduce((s, a) => s + a.hoursCount, 0) ?? 0,
  }));

  const totalShifts = rows.reduce((s, r) => s + r._shifts, 0);
  const totalHours = rows.reduce((s, r) => s + r._hours, 0);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading volunteers…
      </div>
    );

  if (error)
    return (
      <p className="py-10 text-sm text-destructive">
        Failed to load volunteers. Please check your permissions.
      </p>
    );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          { label: "Total Volunteers", value: String(volunteers.length), hint: "in this organization" },
          { label: "Total Shifts", value: String(totalShifts), hint: "across all volunteers" },
          { label: "Total Hours", value: totalHours.toFixed(0), hint: "contributed" },
          {
            label: "Avg Hours / Volunteer",
            value: volunteers.length > 0 ? (totalHours / volunteers.length).toFixed(1) : "0",
            hint: "per volunteer",
          },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <ListPageTemplate<VolunteerRow>
        title="Volunteer Management"
        description="All volunteers registered in this organization with their event assignments."
        crumbs={[{ label: "Event Operations" }, { label: "Volunteers" }]}
        columns={columns}
        rows={rows}
        searchKeys={["_name", "_email", "role"] as any}
        facet={{ label: "Role", key: "role" as any, options: [] }}
        rowActions={[
          { label: "View Profile", onSelect: () => {} },
          { label: "View Events", onSelect: () => {} },
        ]}
      />
    </>
  );
}
