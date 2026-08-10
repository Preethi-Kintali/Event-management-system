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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CampaignCreatePage() {
  return (
    <FormPageTemplate
      title="Create Campaign"
      description="Design and schedule a new communication broadcast."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "New Campaign" },
      ]}
      steps={[
        {
          title: "Campaign Details",
          description: "Basic configuration",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" placeholder="e.g. Registration Reminder" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="channel">Channel</Label>
                <Select defaultValue="email">
                  <SelectTrigger id="channel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
        {
          title: "Audience",
          description: "Who should receive this?",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="audience">Target Segment</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Participants</SelectItem>
                    <SelectItem value="event">Event Participants</SelectItem>
                    <SelectItem value="teams">Teams</SelectItem>
                    <SelectItem value="judges">Judges</SelectItem>
                    <SelectItem value="mentors">Mentors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Estimated reach:{" "}
                <span className="font-semibold text-foreground">1,240 recipients</span>
              </p>
            </div>
          ),
        },
        {
          title: "Message",
          description: "Content and variables",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject Line</Label>
                <Input id="subject" placeholder="Important update regarding your submission" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-end mb-1">
                  <Label htmlFor="message">Message Body</Label>
                  <div className="flex gap-1">
                    {["{{firstName}}", "{{eventName}}"].map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="cursor-pointer hover:bg-muted font-mono text-[10px] py-0"
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Textarea
                  id="message"
                  rows={8}
                  placeholder="Hi {{firstName}}, this is a reminder for..."
                />
              </div>
            </div>
          ),
        },
        {
          title: "Schedule",
          description: "When to send",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="timing">Dispatch Time</Label>
                <Select defaultValue="now">
                  <SelectTrigger id="timing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Immediately</SelectItem>
                    <SelectItem value="later">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
      ]}
      actions={
        <div className="flex gap-2 w-full justify-end">
          <Button variant="outline">Send Test</Button>
          <Button variant="outline">Save Draft</Button>
          <Button>Schedule Campaign</Button>
        </div>
      }
    />
  );
}
