import { Link } from "react-router";
import {
  Radio,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { sources, changes, riskColors } from "./mock-data";
import type { RiskLevel } from "./mock-data";

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date("2026-02-27T11:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

const stats = [
  {
    title: "Sources Monitored",
    value: sources.filter((s) => s.monitoring).length,
    total: sources.length,
    icon: Radio,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Changes This Month",
    value: changes.length,
    subtitle: "Feb 2026",
    icon: FileText,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "High Risk Alerts",
    value: changes.filter((c) => c.riskLevel === "high" || c.riskLevel === "critical")
      .length,
    subtitle: "Requires attention",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Critical Alerts",
    value: changes.filter((c) => c.riskLevel === "critical").length,
    subtitle: "Immediate action",
    icon: TrendingUp,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export function DashboardPage() {
  const latestChanges = [...changes]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compliance monitoring overview and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl text-foreground">{stat.value}</span>
                    {stat.total !== undefined && (
                      <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                    )}
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Changes */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Recent Changes
            </CardTitle>
            <Link to="/changes">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-3">
            {latestChanges.map((change) => {
              const risk = riskColors[change.riskLevel as RiskLevel];
              return (
                <Link
                  key={change.id}
                  to={`/changes/${change.id}`}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm text-foreground">{change.sourceName}</span>
                      <Badge
                        className={`${risk.bg} ${risk.text} border-0 capitalize text-[11px] px-1.5 py-0`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                        {change.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {change.changeSummary}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                    {formatRelativeTime(change.detectedAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => {
                const count = changes.filter((c) => c.riskLevel === level).length;
                const percentage = changes.length > 0 ? (count / changes.length) * 100 : 0;
                const risk = riskColors[level];
                return (
                  <div key={level} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-foreground">{level}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${risk.dot} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Monitored Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {Array.from(new Set(sources.map((s) => s.category))).map((cat) => {
                const count = sources.filter((s) => s.category === cat).length;
                const activeCount = sources.filter(
                  (s) => s.category === cat && s.status === "active"
                ).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {activeCount}/{count} active
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activeCount === count ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
