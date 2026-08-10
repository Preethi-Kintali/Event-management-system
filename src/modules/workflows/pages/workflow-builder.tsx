import { PageHeader } from "@/components/ds/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Plus, Trash2, ArrowDown, Settings2, Save, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useRouter } from "@tanstack/react-router";

export function WorkflowBuilderPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState([
    { id: 1, type: "trigger", title: "When this happens", config: "Registration Created" },
    { id: 2, type: "condition", title: "Only if", config: "Status = Approved" },
    { id: 3, type: "action", title: "Then do this", config: "Send Email" },
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6">
      <div className="flex-none pt-6 pb-4 border-b border-border px-6 -mx-6 mb-6 flex justify-between items-center bg-surface">
        <div>
          <div className="text-xs text-muted-foreground mb-1">New Workflow</div>
          <Input
            defaultValue="Untitled Workflow"
            className="text-lg font-bold border-transparent hover:border-border h-auto py-1 px-2 -ml-2 w-80 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/workflows">Cancel</Link>
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => router.navigate({ to: "/workflows" })}>
            <Play className="w-4 h-4 mr-2" />
            Activate Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/10 -mx-6 px-6 py-8 relative">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center w-full">
              {/* Node */}
              <div className="bg-surface border border-border shadow-sm rounded-lg w-full max-w-md p-4 relative group transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {node.type === "trigger" && (
                      <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center">
                        <Play className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {node.type === "condition" && (
                      <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Settings2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {node.type === "action" && (
                      <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <ZapIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="font-semibold text-sm">{node.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {node.type === "trigger" && (
                  <Select defaultValue="registration.created">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration.created">Registration Created</SelectItem>
                      <SelectItem value="submission.created">Submission Uploaded</SelectItem>
                      <SelectItem value="competition.ended">Competition Ended</SelectItem>
                      <SelectItem value="winner.selected">Winner Selected</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {node.type === "condition" && (
                  <div className="flex gap-2">
                    <Select defaultValue="status">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="equals">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="approved">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {node.type === "action" && (
                  <Select defaultValue="send.email">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send.email">Send Email</SelectItem>
                      <SelectItem value="send.sms">Send SMS</SelectItem>
                      <SelectItem value="assign.judge">Assign Judge</SelectItem>
                      <SelectItem value="generate.certificate">Generate Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Connector */}
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center py-2 group">
                  <div className="h-6 w-0.5 bg-border relative">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 bg-background"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <ArrowDown className="w-4 h-4 text-border" />
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col items-center mt-2 group w-full">
            <div className="h-6 w-0.5 bg-border relative"></div>
            <ArrowDown className="w-4 h-4 text-border mb-4" />
            <Button
              variant="outline"
              className="border-dashed border-2 text-muted-foreground w-full max-w-md h-12"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Step
            </Button>
          </div>

          <div className="mt-8 px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground font-medium flex items-center gap-2 border border-border">
            <div className="w-2 h-2 rounded-full bg-border"></div> End of Workflow
          </div>
        </div>
      </div>
    </div>
  );
}

function ZapIcon(props: any) {
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
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
