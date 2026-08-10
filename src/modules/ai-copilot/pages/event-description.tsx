import { FormPageTemplate } from "@/components/templates/form-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

export function EventDescriptionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResult(
        `**Global AI Summit 2026**\n\nJoin us for the premier artificial intelligence gathering of the year, where innovators, researchers, and developers converge to shape the future of technology.\n\n### Highlights\n- Keynote by industry leaders in generative AI.\n- Hands-on workshops covering neural networks and agentic workflows.\n- Networking opportunities with top-tier tech talent.\n\n### Eligibility\nOpen to university students, professionals, and startup founders with a passion for AI.\n\n### Tags\n#ArtificialIntelligence #MachineLearning #Innovation`,
      );
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <FormPageTemplate
      title="Event Description Generator"
      description="Use AI to draft engaging and comprehensive event landing pages."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Copilot", to: "/ai-copilot" },
        { label: "Generator" },
      ]}
      steps={[
        {
          title: "Provide Context",
          description: "Details about the event",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Event Name</Label>
                <Input id="name" placeholder="e.g. Global AI Summit 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Event Type</Label>
                  <Select defaultValue="hackathon">
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input id="audience" placeholder="e.g. Students, Developers" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="skills">Key Themes / Skills</Label>
                <Input id="skills" placeholder="e.g. AI, React, Startups" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="style">Tone & Style</Label>
                <Select defaultValue="professional">
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional & Formal</SelectItem>
                    <SelectItem value="exciting">Exciting & Energetic</SelectItem>
                    <SelectItem value="academic">Academic & Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="extra">Additional Instructions (Optional)</Label>
                <Textarea
                  id="extra"
                  placeholder="e.g. Mention that food is provided and there is a $10k prize pool."
                  rows={3}
                />
              </div>
            </div>
          ),
        },
        {
          title: "AI Output",
          description: "Review and refine",
          content: (
            <div className="space-y-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-surface/50 text-center">
                  <Sparkles
                    className={`w-10 h-10 text-primary/40 mb-4 ${isGenerating ? "animate-pulse text-primary" : ""}`}
                  />
                  <p className="text-muted-foreground">
                    {isGenerating ? "Drafting content..." : "Fill out the form and click generate."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      className="min-h-[300px] p-4 bg-surface font-mono text-sm leading-relaxed"
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> AI generated
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleGenerate}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy HTML
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
              {isGenerating ? "Generating..." : "Generate Description"}
            </Button>
          )}
          {result && (
            <>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>Save to Drafts</Button>
            </>
          )}
        </div>
      }
    />
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
