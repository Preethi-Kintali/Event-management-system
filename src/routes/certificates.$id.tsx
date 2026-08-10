import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import { MetricWidget } from "@/components/ds/stat-card";

export const Route = createFileRoute("/certificates/$id")({
  head: () => ({
    meta: [
      { title: "Certificate preview · Ascent Platform" },
      {
        name: "description",
        content: "Preview, verify and download issued certificates with serial validation.",
      },
      { property: "og:title", content: "Certificate preview · Ascent Platform" },
      {
        property: "og:description",
        content: "Preview, verify and download issued certificates with serial validation.",
      },
    ],
  }),
  component: CertificatePreviewPage,
});

function CertificatePreviewPage() {
  return (
    <>
      <PageHeader
        title="Certificate preview"
        description="Winner — Hackathon · Northwind Hack the Campus · serial NW-2026-00181"
        crumbs={[
          { label: "Evaluation" },
          { label: "Certificates", to: "/certificates" },
          { label: "Preview" },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title="Preview" description="A4 landscape · 300 dpi">
          <div className="mx-auto flex aspect-[1.414/1] w-full max-w-3xl flex-col items-center justify-center rounded-xl border-2 border-primary/25 bg-surface p-10 text-center shadow-card">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Certificate of achievement
            </p>
            <h2 className="text-display mt-6 text-3xl font-semibold">Rhea Kapoor</h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              has been awarded first place in the Campus Robotics Sprint at Northwind Hack the
              Campus, held 22–24 August 2026.
            </p>
            <div className="mt-10 grid w-full max-w-lg grid-cols-2 gap-8 text-left">
              <div className="border-t border-border pt-2">
                <p className="text-xs text-muted-foreground">Program Director</p>
                <p className="text-sm font-medium">Ananya Iyer</p>
              </div>
              <div className="border-t border-border pt-2 text-right">
                <p className="text-xs text-muted-foreground">Serial</p>
                <p className="font-mono text-sm font-medium">NW-2026-00181</p>
              </div>
            </div>
          </div>
        </SectionCard>
        <aside className="space-y-3">
          <MetricWidget label="Status" value="Issued" caption="25 Aug 2026" tone="success" />
          <MetricWidget label="Verification checks" value="18" caption="last check 2 days ago" />
          <MetricWidget label="Template" value="Winner — Hackathon" caption="v3 · published" />
          <MetricWidget label="Delivery" value="Email + wallet" caption="opened 4 times" />
        </aside>
      </div>
    </>
  );
}
