import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Filter, Calendar, Search } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { changes, riskColors, sources } from "./mock-data";
import type { RiskLevel } from "./mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChangesFeedPage() {
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChanges = changes
    .filter((c) => riskFilter === "all" || c.riskLevel === riskFilter)
    .filter((c) => sourceFilter === "all" || c.sourceId === sourceFilter)
    .filter(
      (c) =>
        searchQuery === "" ||
        c.changeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sourceName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground">Changes Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chronological log of all detected regulatory changes
        </p>
      </div>

      {/* Filters */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search changes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredChanges.length} of {changes.length} changes
      </p>

      {/* Changes Cards */}
      <div className="space-y-3">
        {filteredChanges.map((change) => {
          const risk = riskColors[change.riskLevel as RiskLevel];
          return (
            <Card
              key={change.id}
              className="border border-border hover:border-border/80 transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-foreground">{change.sourceName}</span>
                      <Badge
                        className={`${risk.bg} ${risk.text} border-0 capitalize text-[11px] px-1.5 py-0`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${risk.dot}`}
                        />
                        {change.riskLevel}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                        {change.affectedSector.split(",")[0]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {change.changeSummary}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(change.detectedAt)}
                      </span>
                    </div>
                  </div>
                  <Link to={`/changes/${change.id}`} className="shrink-0">
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredChanges.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            No changes match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}
