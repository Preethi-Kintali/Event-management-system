import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { ApplicationLog } from "../types/developer.types";
import { useDeveloperLogs } from "../hooks/developer.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LogsPage() {
  const { data: logs = [], isLoading } = useDeveloperLogs();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "FATAL":
        return "bg-destructive text-destructive-foreground font-bold";
      case "ERROR":
        return "text-destructive border-destructive/30 bg-destructive/10";
      case "WARN":
        return "text-amber-500 border-amber-500/30 bg-amber-500/10";
      case "INFO":
        return "text-blue-500 border-blue-500/30 bg-blue-500/10";
      default:
        return "text-muted-foreground border-border bg-muted";
    }
  };

  return (
    <>
      <PageHeader
        title="Application Logs"
        description="Search and filter system logs across all microservices."
        crumbs={[
          { label: "System / Admin" },
          { label: "Developer", to: "/developer" },
          { label: "Logs" },
        ]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        }
      />

      <div className="mt-6 flex flex-col h-[calc(100vh-220px)] border border-border rounded-lg overflow-hidden bg-surface">
        <div className="p-3 border-b border-border bg-muted/30 flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs (e.g., error, user_id)..."
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="ERROR">Error & Fatal</SelectItem>
              <SelectItem value="WARN">Warning</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="api">api-gateway</SelectItem>
              <SelectItem value="auth">auth-service</SelectItem>
              <SelectItem value="db">db-pool</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-9 w-9 ml-auto">
            <Terminal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto bg-card font-mono text-[11px] sm:text-xs">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur text-muted-foreground border-b border-border z-10">
              <tr>
                <th className="px-4 py-2 font-medium font-sans">Timestamp</th>
                <th className="px-4 py-2 font-medium font-sans w-24">Level</th>
                <th className="px-4 py-2 font-medium font-sans">Service</th>
                <th className="px-4 py-2 font-medium font-sans w-full">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 group">
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={`rounded-[4px] px-1.5 py-0 text-[10px] uppercase border font-mono ${getLevelColor(log.level)}`}
                    >
                      {log.level}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-primary/80 whitespace-nowrap">{log.service}</td>
                  <td className="px-4 py-2 flex flex-col">
                    <span
                      className={
                        log.level === "ERROR" || log.level === "FATAL"
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {log.message}
                    </span>
                    <span className="text-[9px] opacity-40 mt-0.5">ReqID: {log.requestId}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
