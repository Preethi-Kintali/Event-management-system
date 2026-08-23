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
import { useState, useEffect } from "react";
import { GroupedBarChart } from "@/components/ds/charts";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function ReportGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [reportType, setReportType] = useState("post-event");
  const [eventId, setEventId] = useState("all");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecs, setIncludeRecs] = useState(true);
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchApi("/events").then(res => setEvents(res.data || []));
    fetchApi("/ai-copilot/reports").then(res => setHistory(res.data || []));
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await fetchApi("/ai-copilot/generate/insights-report", {
        method: "POST",
        body: JSON.stringify({ reportType, eventId, includeCharts, includeRecs })
      });
      if (res.data?.report) {
        setResult(res.data.report);
        fetchApi("/ai-copilot/reports").then(r => setHistory(r.data || []));
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast.success("Publish succeeded");
    navigate({ to: "/reports" });
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
                <Select value={reportType} onValueChange={setReportType}>
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
                <Select value={eventId} onValueChange={setEventId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events (YTD)</SelectItem>
                    {events.map((evt) => (
                      <SelectItem key={evt.id} value={evt.id}>{evt.name}</SelectItem>
                    ))}
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
                <Switch id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
              </div>
              <div className="flex justify-between items-center border border-border p-4 rounded-lg bg-surface">
                <div className="space-y-0.5">
                  <Label htmlFor="recs">Include Recommendations</Label>
                  <p className="text-xs text-muted-foreground">
                    AI will append actionable next steps.
                  </p>
                </div>
                <Switch id="recs" checked={includeRecs} onCheckedChange={setIncludeRecs} />
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
                    <h3 className="text-2xl font-bold mb-2">Insights Report</h3>
                    <p className="text-muted-foreground text-sm">Generated on {new Date().toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
                    <p>{result.summary}</p>
                  </div>
                  
                  {result.highlights && result.highlights.length > 0 && (
                    <div className="pt-4">
                      <h4 className="font-semibold text-sm mb-2">Key Highlights</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {result.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
                      </ul>
                    </div>
                  )}

                  {includeCharts && result.demographicsData && (
                    <div className="pt-4">
                      <h4 className="font-semibold text-sm mb-4">Data Visualization</h4>
                      <GroupedBarChart
                        data={result.demographicsData}
                        xKey="label"
                        series={[{ key: "val", label: "Metric" }]}
                        height={200}
                      />
                    </div>
                  )}

                  {includeRecs && result.recommendations && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold text-sm mb-2 text-emerald-600 dark:text-emerald-400">
                        AI Recommendations
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {result.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ),
        },
        {
          title: "History",
          description: "Previously generated reports",
          content: (
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-border rounded-lg text-muted-foreground">
                  No historical reports found.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {history.map((item) => (
                    <div key={item.id} className="border border-border p-4 rounded-lg bg-surface">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setResult(item.report)}>
                          View
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        Model: {item.model}
                      </div>
                    </div>
                  ))}
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
              <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>Regenerate</Button>
              <Button onClick={handleSave}>
                <Download className="w-4 h-4 mr-2" />
                Publish Report
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
