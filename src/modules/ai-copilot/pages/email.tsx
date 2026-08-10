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

export function EmailGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResult({
        subject: "Action Required: Submit Your Final Project for the Global AI Summit",
        body: "Hi {Participant_Name},\n\nWe hope you're enjoying the Global AI Summit 2026!\n\nThis is a quick reminder that the final submission deadline is approaching. Please ensure your project repository and presentation deck are uploaded to the platform by 11:59 PM tonight.\n\nOur judges are excited to see what you've built.\n\nBest regards,\nThe Organizing Team",
      });
      setIsGenerating(false);
    }, 1200);
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
                  <Select defaultValue="reminder">
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
                  <Select defaultValue="participants">
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
                <Select defaultValue="friendly">
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
              <Button variant="outline">Regenerate</Button>
              <Button>
                <Mail className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
