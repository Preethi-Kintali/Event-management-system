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
import { Sparkles, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function RubricGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResult([
        {
          id: 1,
          crit: "Technical Complexity",
          desc: "The difficulty of the technical implementation and the technologies used.",
          weight: 30,
          range: "1-10",
        },
        {
          id: 2,
          crit: "Business Impact",
          desc: "The potential real-world value and scalability of the solution.",
          weight: 30,
          range: "1-10",
        },
        {
          id: 3,
          crit: "User Experience",
          desc: "The usability, accessibility, and visual appeal of the final product.",
          weight: 20,
          range: "1-10",
        },
        {
          id: 4,
          crit: "Presentation",
          desc: "Clarity of the pitch and ability to answer Q&A effectively.",
          weight: 20,
          range: "1-10",
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const totalWeight = result ? result.reduce((acc, curr) => acc + curr.weight, 0) : 0;

  return (
    <FormPageTemplate
      title="Rubric Generator"
      description="Use AI to formulate balanced scoring frameworks for judges."
      crumbs={[
        { label: "AI & Automation" },
        { label: "Copilot", to: "/ai-copilot" },
        { label: "Rubric Builder" },
      ]}
      steps={[
        {
          title: "Parameters",
          description: "Define evaluation goals",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="goal">Evaluation Goal / Topic</Label>
                <Input id="goal" placeholder="e.g. B2B SaaS Hackathon Final Pitch" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Number of Criteria</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Criteria</SelectItem>
                      <SelectItem value="4">4 Criteria</SelectItem>
                      <SelectItem value="5">5 Criteria</SelectItem>
                      <SelectItem value="6">6 Criteria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty / Strictness</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lenient">Lenient (Beginners)</SelectItem>
                      <SelectItem value="standard">Standard (General)</SelectItem>
                      <SelectItem value="strict">Strict (Professionals)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <Label>Emphasis Preference</Label>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Technical</span>
                  <Slider defaultValue={[50]} max={100} step={10} className="flex-1" />
                  <span>Business</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Generated Framework",
          description: "Adjust weights and save",
          content: (
            <div className="space-y-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-surface/50 text-center">
                  <Sparkles
                    className={`w-10 h-10 text-emerald-500/40 mb-4 ${isGenerating ? "animate-pulse text-emerald-500" : ""}`}
                  />
                  <p className="text-muted-foreground">
                    {isGenerating ? "Analyzing parameters..." : "Awaiting generation."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-surface overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3">Criterion</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 w-24">Weight %</th>
                          <th className="px-4 py-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {result.map((row) => (
                          <tr key={row.id}>
                            <td className="px-4 py-3 font-medium">{row.crit}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{row.desc}</td>
                            <td className="px-4 py-3">
                              <Input type="number" defaultValue={row.weight} className="h-8" />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30 font-medium">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-right">
                            Total Weight
                          </td>
                          <td
                            className={`px-4 py-3 ${totalWeight === 100 ? "text-emerald-500" : "text-destructive"}`}
                          >
                            {totalWeight}%
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded border border-border">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Ensure weights total exactly 100% before saving.
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
              {isGenerating ? "Generating..." : "Generate Rubric"}
            </Button>
          )}
          {result && (
            <>
              <Button variant="outline">Regenerate</Button>
              <Button disabled={totalWeight !== 100}>Save to Library</Button>
            </>
          )}
        </div>
      }
    />
  );
}
