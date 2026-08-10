import { DetailsPageTemplate } from "@/components/templates/details-page";
import { SectionCard } from "@/components/ds/page-header";
import { StatusChip } from "@/components/ds/status-chip";
import { Button } from "@/components/ui/button";

export function TeamDetailsPage() {
  return (
    <DetailsPageTemplate
      title="Neural Nomads"
      description="AI for Accessibility Track · 4 members · led by Rhea Kapoor"
      crumbs={[{ label: "Programs" }, { label: "Teams", to: "/teams" }, { label: "Team details" }]}
      meta={
        <>
          <StatusChip status="active" />
          <span className="text-xs text-muted-foreground">Last updated 12 minutes ago</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Edit</Button>
          <Button>Share</Button>
        </>
      }
      metrics={[
        { label: "Progress", value: "82%" },
        { label: "Submissions", value: "3" },
        { label: "Mentor hours", value: "9.5" },
        { label: "Best score", value: "87.5" },
      ]}
      related={[
        { id: "r1", label: "SUB-2291", meta: "Submission · In review" },
        { id: "r2", label: "Arjun Deshpande", meta: "Mentor · Product Strategy" },
        { id: "r3", label: "Hack the Campus", meta: "Event · 22 Aug 2026" },
      ]}
      overview={
        <SectionCard title="Members" description="4 participants" padded={false}>
          <ul className="divide-y divide-border">
            {[
              { n: "Rhea Kapoor", r: "Team lead · ML" },
              { n: "Arun Sethi", r: "Frontend" },
              { n: "Divya Menon", r: "Research" },
              { n: "Kabir Shah", r: "Design" },
            ].map((m) => (
              <li key={m.n} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium">{m.n}</span>
                <span className="text-xs text-muted-foreground">{m.r}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      }
    />
  );
}
