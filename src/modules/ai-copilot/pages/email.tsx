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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function EmailGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const [purpose, setPurpose] = useState("reminder");
  const [audience, setAudience] = useState("participants");
  const [tone, setTone] = useState("friendly");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await fetchApi("/ai-copilot/generate/email-template", {
        method: "POST",
        body: JSON.stringify({ purpose, audience, tone, info })
      });
      if (res.data) {
        setResult(res.data);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await fetchApi("/communications", {
        method: "POST",
        body: JSON.stringify({
          type: "ANNOUNCEMENT",
          subject: result.subject,
          body: result.body,
          targetAudience: [audience],
          status: "DRAFT"
        })
      });
      toast.success("Publish succeeded");
      navigate({ to: "/communication/logs" });
    } catch (e: any) {
      toast.error(e.message || "Failed to save email draft");
    }
  };

  return (
    <FormPageTemplate
      title="Email Generator"
      description="Draft personalized, context-aware communications for participants and judges."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Copilot", to: "/ai-copilot" },
        { label: "Email Generator" },
      ]}
      steps={[
        {
          title: "Email Parameters",
          description: "Details for the draft",
          content: (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger id="purpose">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="reminder">Deadline Reminder</SelectItem>
                      <SelectItem value="congratulations">Congratulations</SelectItem>
                      <SelectItem value="rejection">Status Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="audience">Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger id="audience">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participants">All Participants</SelectItem>
                      <SelectItem value="judges">Judges</SelectItem>
                      <SelectItem value="mentors">Mentors</SelectItem>
                      <SelectItem value="winners">Winners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly & Encouraging</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="info">Key Information (Bullet points)</Label>
                <Textarea
                  id="info"
                  placeholder="- Submission deadline is 11:59 PM tonight&#10;- Must include repo link and slides"
                  rows={3}
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                />
              </div>
            </div>
          ),
        },
        {
          title: "Generated Draft",
          description: "Review and edit",
          content: (
            <div className="space-y-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-surface/50 text-center">
                  <Sparkles
                    className={`w-10 h-10 text-blue-500/40 mb-4 ${isGenerating ? "animate-pulse text-blue-500" : ""}`}
                  />
                  <p className="text-muted-foreground">
                    {isGenerating ? "Composing email..." : "Awaiting generation."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Subject Line</Label>
                    <Input
                      value={result.subject}
                      onChange={(e) => setResult({ ...result, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email Body</Label>
                    <Textarea
                      className="min-h-[250px] font-mono text-sm leading-relaxed"
                      value={result.body}
                      onChange={(e) => setResult({ ...result, body: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Uses dynamic tags
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
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
              {isGenerating ? "Generating..." : "Generate Email"}
            </Button>
          )}
          {result && (
            <>
              <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>Regenerate</Button>
              <Button onClick={handleSave}>
                <Mail className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
