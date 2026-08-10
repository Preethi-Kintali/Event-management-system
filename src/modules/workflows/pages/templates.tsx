import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { WorkflowsService } from "../services/workflows.service";
import { WorkflowTemplate } from "../types/workflows.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Copy, Blocks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

export function TemplatesPage() {
  const [data, setData] = useState<WorkflowTemplate[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    WorkflowsService.getTemplates().then(setData);
  }, []);

  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Workflow Templates"
        description="Start fast with pre-built automation recipes for common platform tasks."
        crumbs={[
          { label: "AI & Automation" },
          { label: "Workflows", to: "/workflows" },
          { label: "Templates" },
        ]}
      />

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((tpl) => (
          <SectionCard key={tpl.id} title="" description="" className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Blocks className="w-5 h-5" />
              </div>
              <Badge variant="outline">{tpl.category}</Badge>
            </div>

            <div className="flex-1 space-y-2 mb-6">
              <h3 className="font-semibold text-lg">{tpl.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{tpl.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border mt-auto">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Trigger: {tpl.trigger}</span>
                <span>{tpl.actionCount} Actions</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link to="/workflows/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Use Template
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
