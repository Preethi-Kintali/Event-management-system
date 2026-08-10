import { FormPageTemplate } from "@/components/templates/form-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Download, FileBarChart2 } from "lucide-react";
import { useState } from "react";
import { GroupedBarChart } from "@/components/ds/charts";

export function ReportGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResult(true);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <FormPageTemplate
      title="Insights Report Generator"
      description="Compile complex event data into readable summaries."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Copilot", to: "/ai-copilot" },
        { label: "Reports" },
      ]}
      steps={[
        {
          title: "Report Configuration",
          description: "Select data sources",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label>Report Type</Label>
                <Select defaultValue="post-event">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post-event">Post-Event Executive Summary</SelectItem>
                    <SelectItem value="participant">Participant Demographics</SelectItem>
                    <SelectItem value="engagement">Engagement Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Target Event</Label>
                <Select defaultValue="ai-summit">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-summit">Global AI Summit</SelectItem>
                    <SelectItem value="hack-campus">Hack the Campus</SelectItem>
                    <SelectItem value="all">All Events (YTD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center border border-border p-4 rounded-lg bg-surface">
                <div className="space-y-0.5">
                  <Label htmlFor="charts">Include Data Visualizations</Label>
                  <p className="text-xs text-muted-foreground">
                    AI will select and insert relevant charts.
                  </p>
                </div>
                <Switch id="charts" defaultChecked />
              </div>
              <div className="flex justify-between items-center border border-border p-4 rounded-lg bg-surface">
                <div className="space-y-0.5">
                  <Label htmlFor="recs">Include Recommendations</Label>
                  <p className="text-xs text-muted-foreground">
                    AI will append actionable next steps.
                  </p>
                </div>
                <Switch id="recs" defaultChecked />
              </div>
            </div>
          ),
        },
        {
          title: "Preview",
          description: "Review generated insights",
          content: (
            <div className="space-y-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-surface/50 text-center">
                  <Sparkles
                    className={`w-10 h-10 text-amber-500/40 mb-4 ${isGenerating ? "animate-pulse text-amber-500" : ""}`}
                  />
                  <p className="text-muted-foreground">
                    {isGenerating ? "Analyzing data models..." : "Awaiting generation."}
                  </p>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-6 bg-surface space-y-6">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-2xl font-bold mb-2">Executive Summary: Global AI Summit</h3>
                    <p className="text-muted-foreground text-sm">Generated on August 10, 2026</p>
                  </div>

                  <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                      The Global AI Summit successfully concluded with{" "}
                      <strong>1,240 active participants</strong> and an overall satisfaction rating
                      of <strong>4.8/5.0</strong>.
                    </p>
                    <p>
                      Key highlights include a 35% increase in cross-organization networking
                      compared to previous iterations, driven largely by the new matching algorithm.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold text-sm mb-4">Participant Demographics</h4>
                    <GroupedBarChart
                      data={[
                        { label: "Students", val: 65 },
                        { label: "Professionals", val: 25 },
                        { label: "Founders", val: 10 },
                      ]}
                      xKey="label"
                      series={[{ key: "val", label: "% of Attendees" }]}
                      height={200}
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-sm mb-2 text-emerald-600 dark:text-emerald-400">
                      AI Recommendations for Next Event
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Increase workshop duration; 40% of feedback cited time constraints.</li>
                      <li>
                        Expand backend/infrastructure challenges to balance the heavy ML focus.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ),
        },
      ]}
      actions={
        <div className="flex gap-2 w-full justify-end">
          {!result && (
            <Button onClick={handleGenerate} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Compile Report"}
            </Button>
          )}
          {result && (
            <>
              <Button variant="outline">Regenerate</Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
