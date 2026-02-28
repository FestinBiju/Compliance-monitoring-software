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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time compliance monitoring and regulatory intelligence
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    {stat.total !== undefined && (
                      <span className="text-base text-muted-foreground font-medium">/ {stat.total}</span>
                    )}
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground font-medium">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Changes */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
              <div className="p-2 rounded-lg bg-blue-50">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              Recent Changes
            </CardTitle>
            <Link to="/changes">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                View All
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <div className="space-y-2">
            {latestChanges.map((change, index) => {
              const risk = riskColors[change.riskLevel as RiskLevel];
              return (
                <Link
                  key={change.id}
                  to={`/changes/${change.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{change.sourceName}</span>
                      <Badge
                        className={`${risk.bg} ${risk.text} border-0 capitalize text-[11px] px-2 py-0.5 font-medium`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${risk.dot} mr-1`} />
                        {change.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {change.changeSummary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {formatRelativeTime(change.detectedAt)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => {
                const count = changes.filter((c) => c.riskLevel === level).length;
                const percentage = changes.length > 0 ? (count / changes.length) * 100 : 0;
                const risk = riskColors[level];
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium text-foreground">{level}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full ${risk.dot} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Radio className="w-4 h-4 text-indigo-600" />
              </div>
              Monitored Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2.5">
              {Array.from(new Set(sources.map((s) => s.category))).map((cat) => {
                const count = sources.filter((s) => s.category === cat).length;
                const activeCount = sources.filter(
                  (s) => s.category === cat && s.status === "active"
                ).length;
                const percentage = (activeCount / count) * 100;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        percentage === 100 ? "bg-emerald-500" : percentage > 50 ? "bg-amber-500" : "bg-red-500"
                      } shadow-sm`} />
                      <span className="text-sm font-medium text-foreground">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {activeCount}/{count} active
                      </span>
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
