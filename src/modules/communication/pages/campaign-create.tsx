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
import { useCreateCommunication } from "../services/communications.api";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function CampaignCreatePage() {
  const createComm = useCreateCommunication();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("ANNOUNCEMENT");
  const [audience, setAudience] = useState("ALL");
  const [content, setContent] = useState("");

  const handleCreate = (status: "DRAFT" | "PUBLISHED") => {
    createComm.mutate(
      { title, type: type as any, audience, content, status },
      {
        onSuccess: () => {
          toast.success(`Communication ${status === "PUBLISHED" ? "published" : "saved"}!`);
          navigate({ to: "/communication/campaigns" });
        },
        onError: (e: any) => toast.error(e.message || "Failed to create communication"),
      }
    );
  };

  return (
    <FormPageTemplate
      title="Create Communication"
      description="Design and schedule a new communication broadcast."
      crumbs={[
        { label: "Engagement" },
        { label: "Communication", to: "/communication" },
        { label: "New Campaign" },
      ]}
      steps={[
        {
          title: "Details",
          description: "Basic configuration",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Registration Reminder" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                    <SelectItem value="REMINDER">Reminder</SelectItem>
                    <SelectItem value="ALERT">Alert</SelectItem>
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
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Members</SelectItem>
                    <SelectItem value="JUDGES">Judges</SelectItem>
                    <SelectItem value="MENTORS">Mentors</SelectItem>
                    <SelectItem value="VOLUNTEERS">Volunteers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
        {
          title: "Message",
          description: "Content",
          content: (
            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="message">Message Body</Label>
                <Textarea
                  id="message"
                  rows={8}
                  placeholder="Hello everyone, we wanted to announce..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          ),
        },
      ]}
      actions={
        <div className="flex gap-2 w-full justify-end">
          <Button variant="outline" onClick={() => handleCreate("DRAFT")} disabled={createComm.isPending}>
            Save Draft
          </Button>
          <Button onClick={() => handleCreate("PUBLISHED")} disabled={createComm.isPending}>
            Publish Now
          </Button>
        </div>
      }
    />
  );
}
