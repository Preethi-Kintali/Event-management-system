import { createFileRoute } from "@tanstack/react-router";
import { FormPageTemplate } from "@/components/templates/form-page";
import { DatePicker, MultiSelect, TagInput, TimePicker } from "@/components/ds/form-controls";
import { FileUpload, RichTextEditor } from "@/components/ds/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const Route = createFileRoute("/events/new")({
  head: () => ({
    meta: [
      { title: "Create event · Ascent Platform" },
      { name: "description", content: "Multi-step event creation with validation, scheduling, media and publishing controls." },
      { property: "og:title", content: "Create event · Ascent Platform" },
      { property: "og:description", content: "Multi-step event creation with validation, scheduling, media and publishing controls." },
    ],
  }),
  component: CreateEventPage,
});

function CreateEventPage() {
  const [tags, setTags] = useState<string[]>(["AI", "Accessibility"]);
  const [tracks, setTracks] = useState<string[]>(["Hackathon"]);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");

  return (
    <FormPageTemplate
      title="Create event"
      description="Set up an event, its schedule, competitions and publishing rules."
      crumbs={[{ label: "Programs" }, { label: "Events", to: "/events" }, { label: "Create event" }]}
      steps={[
        {
          title: "Basics",
          description: "Name, category and visibility of the event",
          content: (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="event-name">Event name</Label>
                <Input id="event-name" placeholder="Global AI Innovation Summit 2026" />
                <p className="text-xs text-muted-foreground">
                  Displayed publicly on the listing page.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-category">Category</Label>
                <Select defaultValue="hackathon">
                  <SelectTrigger id="event-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="summit">Summit</SelectItem>
                    <SelectItem value="case">Case study</SelectItem>
                    <SelectItem value="fellowship">Fellowship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <MultiSelect
                label="Tracks"
                options={["Hackathon", "Design", "Case Study", "Research", "Pitch"]}
                value={tracks}
                onChange={setTracks}
              />
              <TagInput label="Tags" tags={tags} onChange={setTags} />
              <div className="lg:col-span-2">
                <RichTextEditor />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-4 lg:col-span-2">
                <div>
                  <p className="text-sm font-medium">Public listing</p>
                  <p className="text-xs text-muted-foreground">
                    Show this event in the global discovery feed.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          ),
        },
        {
          title: "Schedule",
          description: "Dates, timezone and registration windows",
          content: (
            <div className="grid gap-5 lg:grid-cols-3">
              <DatePicker label="Start date" date={start} onSelect={setStart} />
              <DatePicker label="End date" date={end} onSelect={setEnd} />
              <TimePicker label="Daily start time" value={time} onChange={setTime} />
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" defaultValue={2000} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tz">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="tz">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="ist">Asia/Kolkata</SelectItem>
                    <SelectItem value="cet">Europe/Berlin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mode">Mode</Label>
                <Select defaultValue="hybrid">
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        },
        {
          title: "Media",
          description: "Banner, brand assets and supporting documents",
          content: <FileUpload label="Event assets" hint="Banner 1600×600, rules PDF, sponsor kit" />,
        },
        {
          title: "Review",
          description: "Confirm configuration before publishing",
          content: (
            <div className="space-y-3">
              <dl className="divide-y divide-border rounded-lg border border-border">
                {[
                  { k: "Event", v: "Global AI Innovation Summit 2026" },
                  { k: "Category", v: "Hackathon · Hybrid" },
                  { k: "Schedule", v: "14–17 Sep 2026 · UTC" },
                  { k: "Capacity", v: "2,000 participants" },
                  { k: "Visibility", v: "Public listing enabled" },
                ].map((row) => (
                  <div key={row.k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{row.k}</dt>
                    <dd className="text-sm font-medium">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
        },
      ]}
    />
  );
}
