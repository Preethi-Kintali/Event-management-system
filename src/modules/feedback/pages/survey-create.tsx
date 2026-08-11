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
import { Switch } from "@/components/ui/switch";
import { GripVertical, Trash2, PlusCircle } from "lucide-react";

export function SurveyCreatePage() {
  return (
    <FormPageTemplate
      title="Create Survey"
      description="Build custom feedback forms to collect data from participants."
      crumbs={[
        { label: "Engagement" },
        { label: "Feedback", to: "/feedback" },
        { label: "Surveys", to: "/feedback/surveys" },
        { label: "New" },
      ]}
      steps={[
        {
          title: "Survey Configuration",
          description: "Basic details and targeting",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Survey Name</Label>
                <Input id="name" placeholder="e.g. Mentor Evaluation Survey" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event">Target Event</Label>
                <Select defaultValue="e1">
                  <SelectTrigger id="event">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e1">Global AI Summit</SelectItem>
                    <SelectItem value="e2">Hack the Campus</SelectItem>
                    <SelectItem value="e3">Platform Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="audience">Target Audience</Label>
                <Select defaultValue="teams">
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Participants</SelectItem>
                    <SelectItem value="teams">Teams</SelectItem>
                    <SelectItem value="judges">Judges</SelectItem>
                    <SelectItem value="mentors">Mentors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
        {
          title: "Form Builder",
          description: "Design your questions",
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  { type: "Rating", q: "How would you rate the mentorship you received?" },
                  { type: "Text", q: "What could be improved?" },
                ].map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg bg-surface relative group"
                  >
                    <div className="mt-2 cursor-move text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 grid gap-4">
                      <div className="flex justify-between gap-4">
                        <div className="flex-1 space-y-1.5">
                          <Label>Question {i + 1}</Label>
                          <Input defaultValue={q.q} />
                        </div>
                        <div className="w-48 space-y-1.5">
                          <Label>Type</Label>
                          <Select defaultValue={q.type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rating">Rating (1-5)</SelectItem>
                              <SelectItem value="Text">Long Text</SelectItem>
                              <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                              <SelectItem value="Yes/No">Yes/No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={i === 0} id={`req-${i}`} />
                          <Label htmlFor={`req-${i}`}>Required</Label>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full border-dashed">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          ),
        },
      ]}

    />
  );
}
