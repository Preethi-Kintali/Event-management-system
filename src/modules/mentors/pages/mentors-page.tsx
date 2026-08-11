import { Loader2 } from "lucide-react";
import { StatCard } from "@/components/ds/stat-card";
import { ListPageTemplate } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import type { Column } from "@/components/ds/data-table";
import { useMentors, ApiMentor } from "../services/mentors.api";

type MentorRow = ApiMentor & { _name: string; _email: string; _teams: number };

const columns: Column<MentorRow>[] = [
  {
    key: "_name" as any,
    header: "Mentor",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium">{row._name}</p>
        <p className="text-xs text-muted-foreground">{row._email}</p>
      </div>
    ),
  },
  {
    key: "expertise" as any,
    header: "Expertise",
    sortable: true,
    render: (row) =>
      row.expertise ? (
        <Badge variant="outline">{row.expertise}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "_teams" as any,
    header: "Teams",
    sortable: true,
    render: (row) => <span className="tabular-nums">{row._teams}</span>,
  },
  {
    key: "createdAt" as any,
    header: "Joined",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.createdAt).toLocaleDateString()}
      </span>
    ),
  },
];

export function MentorsPage() {
  const { data: mentors = [], isLoading, error } = useMentors();

  const rows: MentorRow[] = mentors.map((m) => ({
    ...m,
    _name:
      m.user
        ? `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.trim() || m.user.email
        : m.userId,
    _email: m.user?.email ?? "—",
    _teams: m.teamAssignments?.length ?? 0,
  }));

  const totalTeams = rows.reduce((s, r) => s + r._teams, 0);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading mentors…
      </div>
    );

  if (error)
    return (
      <p className="py-10 text-sm text-destructive">
        Failed to load mentors. Please check your permissions.
      </p>
    );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          { label: "Total Mentors", value: String(mentors.length), hint: "in this organization" },
          { label: "Teams Mentored", value: String(totalTeams), hint: "active assignments" },
          {
            label: "Avg Teams / Mentor",
            value: mentors.length > 0 ? (totalTeams / mentors.length).toFixed(1) : "0",
            hint: "per mentor",
          },
          {
            label: "Mentors with Teams",
            value: String(rows.filter((r) => r._teams > 0).length),
            hint: "active mentors",
          },
        ].map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <ListPageTemplate<MentorRow>
        title="Mentor Management"
        description="All mentors registered in this organization with their team assignments."
        crumbs={[{ label: "Event Operations" }, { label: "Mentors" }]}
        columns={columns}
        rows={rows}
        searchKeys={["_name", "_email", "expertise"] as any}
        facet={{ label: "Expertise", key: "expertise" as any, options: [] }}
        rowActions={[
          { label: "View Profile", onSelect: () => {} },
          { label: "View Teams", onSelect: () => {} },
        ]}
      />
    </>
  );
}
