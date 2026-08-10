import { PageHeader, SectionCard } from "@/components/ds/page-header";
import { IntegrationsService } from "../services/integrations.service";
import { Integration } from "../types/integrations.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MarketplacePage() {
  const [data, setData] = useState<Integration[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    IntegrationsService.getMarketplace().then(setData);
  }, []);

  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="App Marketplace"
        description="Discover and connect third-party tools to extend platform functionality."
        crumbs={[
          { label: "System / Admin" },
          { label: "Integrations", to: "/integrations" },
          { label: "Marketplace" },
        ]}
      />

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((int) => (
          <SectionCard key={int.id} title="" description="" className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Avatar className="w-12 h-12 rounded-lg bg-surface border border-border p-1">
                <AvatarImage src={int.logo} />
                <AvatarFallback>{int.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Badge variant="outline">{int.category}</Badge>
            </div>

            <div className="flex-1 space-y-2 mb-6">
              <h3 className="font-semibold text-lg">{int.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{int.description}</p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
              {int.status === "Connected" ? (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not Connected</span>
              )}

              <Button variant={int.status === "Connected" ? "outline" : "default"} size="sm">
                {int.status === "Connected" ? (
                  "Configure"
                ) : (
                  <>
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Connect
                  </>
                )}
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
