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
import { FileUpload } from "@/components/ds/file-upload";

export function BadgeCreatePage() {
  return (
    <FormPageTemplate
      title="Create Badge"
      description="Design a new achievement badge and define its criteria."
      crumbs={[{ label: "Engagement" }, { label: "Badges", to: "/badges" }, { label: "New Badge" }]}
      steps={[
        {
          title: "Badge Details",
          description: "Core identity of the badge",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Badge Name</Label>
                <Input id="name" placeholder="e.g. Master Developer" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} placeholder="Describe what this badge represents..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="coding">
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participation">Participation</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="teamwork">Teamwork</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="level">Level</Label>
                  <Select defaultValue="silver">
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Visuals",
          description: "Upload badge artwork",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label>Badge Image (SVG/PNG, min 512x512)</Label>
                <FileUpload onUpload={() => {}} />
              </div>
            </div>
          ),
        },
        {
          title: "Criteria & Rules",
          description: "How users earn this badge",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="xp">XP Points Awarded</Label>
                <Input id="xp" type="number" defaultValue="100" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="criteria">Earning Criteria</Label>
                <Textarea
                  id="criteria"
                  rows={3}
                  placeholder="e.g. Must complete all 5 modules in the beginner track."
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-4">
                <div>
                  <p className="text-sm font-medium">Active Status</p>
                  <p className="text-xs text-muted-foreground">Badge can be earned immediately.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          ),
        },
      ]}
      actions={
        <div className="flex gap-2 w-full justify-end">
          <Button variant="outline">Preview</Button>
          <Button variant="outline">Save Draft</Button>
          <Button>Publish Badge</Button>
        </div>
      }
    />
  );
}
