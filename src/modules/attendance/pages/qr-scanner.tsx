import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Scan, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

export function QRScannerPage() {
  return (
    <>
      <PageHeader
        title="QR Attendance Scanner"
        description="Select a session to begin accepting attendee check-ins."
        crumbs={[
          { label: "Event Operations" },
          { label: "Attendance", to: "/attendance" },
          { label: "QR Scanner" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <SectionCard title="Session Configuration" description="Target event and session">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="event">Event</Label>
              <Select defaultValue="e1">
                <SelectTrigger id="event">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e1">Global AI Innovation Summit 2026</SelectItem>
                  <SelectItem value="e2">Northwind Hack the Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="session">Session</Label>
              <Select defaultValue="s1">
                <SelectTrigger id="session">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">Opening Keynote</SelectItem>
                  <SelectItem value="s2">Workshop A</SelectItem>
                  <SelectItem value="s3">Networking Lunch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-2">
              <QrCode className="w-4 h-4 mr-2" />
              Generate Session QR
            </Button>
            <Button variant="outline" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Use Camera Scanner
            </Button>
          </div>
        </SectionCard>

        <div className="flex flex-col gap-6">
          <SectionCard className="flex-1 flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="bg-muted p-6 rounded-2xl mb-6">
              <QrCode className="w-32 h-32 opacity-20" />
            </div>
            <h3 className="text-xl font-medium mb-2">Display QR for Attendees</h3>
            <p className="text-muted-foreground max-w-md">
              Select an event and session from the left panel to generate a unique QR code.
              Attendees can scan this code with their mobile device to check in.
            </p>
          </SectionCard>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Checked In</p>
                  <p className="text-xs text-muted-foreground">This session</p>
                </div>
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted p-2 rounded-md text-muted-foreground">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Recent Scan</p>
                  <p className="text-xs text-muted-foreground">Awaiting check-in...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
