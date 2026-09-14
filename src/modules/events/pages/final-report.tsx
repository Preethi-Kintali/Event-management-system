import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useEvent, useExecutionSummary } from "../services/events.api";
import {
  useFinalReport,
  useSaveDraftReport,
  useGenerateAIDraft,
  useFinalizeReport,
} from "../services/final-report.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Printer, RefreshCcw, ArrowLeft, Trophy, Users, CheckCircle, Activity, Award, Save, Wand2, Download } from "lucide-react";
import { toast } from "sonner";
import { StatusChip } from "@/components/ds/status-chip";
import { useAuth } from "@/lib/auth";
import { FileUpload, RichTextEditor } from "@/components/ds/file-upload";

export function FinalReportPage({ eventId }: { eventId?: string }) {
  const { id: paramId } = useParams({ strict: false }) as { id?: string };
  const id = eventId || paramId || "";
  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const { data: report, isLoading: isReportLoading } = useFinalReport(id);
  const { data: executionSummary } = useExecutionSummary(id);

  const saveDraft = useSaveDraftReport();
  const generateAIDraft = useGenerateAIDraft();
  const finalizeReport = useFinalizeReport();
  const { hasPermission } = useAuth();

  const [formData, setFormData] = useState({
    executiveSummary: "",
    eventOutcome: "",
    keyHighlights: "",
    challenges: "",
    recommendations: "",
    additionalRemarks: "",
  });

  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (report) {
      setFormData({
        executiveSummary: report.executiveSummary || "",
        eventOutcome: report.eventOutcome || "",
        keyHighlights: report.keyHighlights || "",
        challenges: report.challenges || "",
        recommendations: report.recommendations || "",
        additionalRemarks: report.additionalRemarks || "",
      });
      if (report.status === "AI_GENERATED") {
        setEditorContent(report.finalizedContent || report.aiGeneratedContent || "");
      }
    }
  }, [report]);

  if (isEventLoading || isReportLoading) {
    return <div className="p-8">Loading report...</div>;
  }

  if (!event) {
    return (
      <div className="p-8">
        <div className="mb-4 text-xl font-bold">Event not found.</div>
        <Link to="/events/$id" params={{ id }}>
          <Button variant="outline">Back to Event</Button>
        </Link>
      </div>
    );
  }

  const isCoordinator = hasPermission("reports.update_assigned");
  const status = report?.status || "DRAFT";
  const metrics = executionSummary || {} as any;

  const handleSaveDraft = async () => {
    try {
      await saveDraft.mutateAsync({ eventId: id, data: { ...formData, supportingDocuments: [] } });
      toast.success("Draft saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save draft");
    }
  };

  const handleGenerateAI = async () => {
    try {
      await saveDraft.mutateAsync({ eventId: id, data: { ...formData, supportingDocuments: [] } });
      await generateAIDraft.mutateAsync(id);
      toast.success("AI Draft generated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI draft");
    }
  };

  const handleFinalize = async () => {
    if (confirm("Are you sure you want to finalize this report? It cannot be changed afterwards.")) {
      try {
        await finalizeReport.mutateAsync({ eventId: id, finalizedContent: editorContent });
        toast.success("Report finalized successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to finalize report");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('ascent_token');
      const activeOrgId = localStorage.getItem('ascent_active_org');
      const baseUrl = import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api/v1';
      
      const res = await fetch(`${baseUrl}/events/${id}/final-report/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(activeOrgId ? { 'x-organization-id': activeOrgId } : {})
        }
      });
      
      if (!res.ok) throw new Error("Failed to download PDF");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Final_Report_${event.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      toast.error(err.message || "Failed to download PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top Action Bar */}
      <div className="print:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/events/$id" params={{ id }}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Event
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {status === "DRAFT" && isCoordinator && (
              <>
                <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saveDraft.isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                <Button variant="default" size="sm" onClick={handleGenerateAI} disabled={generateAIDraft.isPending || saveDraft.isPending} className="gap-2">
                  <Wand2 className={`w-4 h-4 ${generateAIDraft.isPending ? "animate-spin" : ""}`} />
                  Generate AI Draft
                </Button>
              </>
            )}
            {status === "AI_GENERATED" && isCoordinator && (
              <>
                <Button variant="outline" size="sm" onClick={handleGenerateAI} disabled={generateAIDraft.isPending} className="gap-2">
                  <RefreshCcw className={`w-4 h-4 ${generateAIDraft.isPending ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
                <Button variant="default" size="sm" onClick={handleFinalize} disabled={finalizeReport.isPending} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Finalize Report
                </Button>
              </>
            )}
            {status === "FINALIZED" && (
              <>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print Report
                </Button>
                <Button variant="default" size="sm" onClick={handleDownloadPDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0">
        
        {/* Report Header */}
        <div className="border-b pb-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">{event.name}</h1>
              <div className="text-xl text-muted-foreground font-medium">Final Hackathon Report</div>
            </div>
            <div className="print:hidden">
              <StatusChip status={status.toLowerCase() as any} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</div>
              <div className="font-medium">{status.replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Event Dates</div>
              <div className="font-medium">{new Date(event.startTime).toLocaleDateString()} - {new Date(event.endTime).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Status: DRAFT */}
        {status === "DRAFT" && (
          <div className="space-y-8 print:hidden">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Draft Mode</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Please enter the required information below. Once completed, you can generate an AI draft that will combine your inputs with the event's execution metrics.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Executive Summary</Label>
                <Textarea 
                  placeholder="Provide a brief overview of the entire event..."
                  value={formData.executiveSummary}
                  onChange={(e) => setFormData(p => ({ ...p, executiveSummary: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Event Outcome & Impact</Label>
                <Textarea 
                  placeholder="What were the main outcomes of the event?"
                  value={formData.eventOutcome}
                  onChange={(e) => setFormData(p => ({ ...p, eventOutcome: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Key Highlights</Label>
                <Textarea 
                  placeholder="List the most significant achievements or memorable moments..."
                  value={formData.keyHighlights}
                  onChange={(e) => setFormData(p => ({ ...p, keyHighlights: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Challenges Faced</Label>
                <Textarea 
                  placeholder="What difficulties did the team encounter?"
                  value={formData.challenges}
                  onChange={(e) => setFormData(p => ({ ...p, challenges: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Recommendations for Future</Label>
                <Textarea 
                  placeholder="What can be improved for the next iteration?"
                  value={formData.recommendations}
                  onChange={(e) => setFormData(p => ({ ...p, recommendations: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Remarks</Label>
                <Input 
                  placeholder="Any other comments?"
                  value={formData.additionalRemarks}
                  onChange={(e) => setFormData(p => ({ ...p, additionalRemarks: e.target.value }))}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-4">Supporting Documents</h3>
                <FileUpload label="Upload Attendance Sheets, Photos, or Financial Receipts" />
              </div>
            </div>
          </div>
        )}

        {/* Status: AI GENERATED */}
        {status === "AI_GENERATED" && (
          <div className="space-y-8 print:hidden">
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Review AI Draft</h3>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                The AI has generated a draft based on your inputs and event metrics. Review and edit the markdown below before finalizing.
              </p>
            </div>
            
            <RichTextEditor 
              label="Finalized Report Markdown"
              value={editorContent}
              onChange={setEditorContent}
            />
          </div>
        )}

        {/* Status: FINALIZED */}
        {status === "FINALIZED" && (
          <>
            {/* Execution Metrics Snapshot */}
            <section className="mb-12 print:break-inside-avoid">
              <h2 className="text-2xl font-bold tracking-tight border-b pb-2 mb-6">Execution Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface border p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-sm uppercase tracking-wider">Registrations</span>
                  </div>
                  <div className="text-3xl font-black mb-1">{metrics.registrations?.totalRegistered || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{metrics.registrations?.approvedParticipants || 0}</span> Approved &bull; <span className="font-medium text-foreground">{metrics.registrations?.paidParticipants || 0}</span> Paid
                  </div>
                </div>

                <div className="bg-surface border p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-sm uppercase tracking-wider">Attendance</span>
                  </div>
                  <div className="text-3xl font-black mb-1">{metrics.attendance?.uniqueAttendees || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    Unique Attendees ({metrics.attendance?.attendancePercentage || 0}%)
                  </div>
                </div>

                <div className="bg-surface border p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-sm uppercase tracking-wider">Competitions</span>
                  </div>
                  <div className="text-3xl font-black mb-1">{metrics.competition?.totalCompetitions || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{metrics.competition?.totalTeams || 0}</span> Teams &bull; <span className="font-medium text-foreground">{metrics.competition?.totalSubmissions || 0}</span> Submissions
                  </div>
                </div>

                <div className="bg-surface border p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold text-sm uppercase tracking-wider">Volunteers</span>
                  </div>
                  <div className="text-3xl font-black mb-1">{metrics.volunteers?.totalVolunteers || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{metrics.volunteers?.totalVolunteerHours || 0}</span> Total Hours
                  </div>
                </div>
              </div>
            </section>

            {/* Final Report Content */}
            <section className="prose prose-slate max-w-none prose-headings:font-bold mt-10">
              <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground">
                {report?.finalizedContent || report?.aiGeneratedContent}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
