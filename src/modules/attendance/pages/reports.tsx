import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { GroupedBarChart } from "@/components/ds/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function AttendanceReportsPage() {
  return (
    <>
      <PageHeader
        title="Attendance Reports"
        description="Analytics and exportable trends for event participation."
        crumbs={[
          { label: "Event Operations" },
          { label: "Attendance", to: "/attendance" },
          { label: "Reports" },
        ]}
        actions={
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Event-wise Attendance" description="Comparison across recent events">
          <GroupedBarChart
            data={[
              { event: "Global AI Summit", present: 4820, absent: 1180 },
              { event: "Hack the Campus", present: 1940, absent: 60 },
              { event: "Design Challenge", present: 812, absent: 45 },
              { event: "Case Study Cup", present: 2260, absent: 140 },
            ]}
            xKey="event"
            series={[
              { key: "present", label: "Present" },
              { key: "absent", label: "Absent" },
            ]}
            height={300}
          />
        </SectionCard>

        <SectionCard title="Attendance by Organization Type" description="Demographic breakdown">
          <GroupedBarChart
            data={[
              { org: "University", rate: 94 },
              { org: "Corporate", rate: 82 },
              { org: "Non-profit", rate: 88 },
              { org: "Government", rate: 76 },
            ]}
            xKey="org"
            series={[{ key: "rate", label: "Attendance %" }]}
            height={300}
          />
        </SectionCard>
      </div>
    </>
  );
}
