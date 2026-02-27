import { useParams, Link } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { changes, riskColors, sources } from "./mock-data";
import type { RiskLevel } from "./mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChangeDetailPage() {
  const { id } = useParams();
  const [diffExpanded, setDiffExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const change = changes.find((c) => c.id === id);
  const source = sources.find((s) => s.id === change?.sourceId);

  if (!change) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Change not found.</p>
          <Link to="/changes">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Changes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const risk = riskColors[change.riskLevel as RiskLevel];

  const toggleChecked = (idx: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back Navigation */}
      <Link
        to="/changes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Changes Feed
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={`${risk.bg} ${risk.text} border-0 capitalize px-2 py-0.5`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            {change.riskLevel} Risk
          </Badge>
          <Badge variant="secondary">{change.affectedSector}</Badge>
        </div>
        <h1 className="text-foreground leading-tight">{change.changeSummary}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>Source: {change.sourceName}</span>
          <span>Detected: {formatDate(change.detectedAt)}</span>
          {source && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              View Original
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - AI Summary + Affected */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {change.aiSummary}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Affected Sectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {change.affectedSector.split(",").map((sector) => (
                  <Badge
                    key={sector.trim()}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {sector.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Details */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${risk.bg}`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${risk.dot}`}
                  />
                  <span className={`capitalize ${risk.text}`}>
                    {change.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {change.riskLevel === "critical" &&
                    "Immediate action required. This change has significant regulatory impact."}
                  {change.riskLevel === "high" &&
                    "Prompt attention needed. Review and plan remediation within 2 weeks."}
                  {change.riskLevel === "medium" &&
                    "Moderate impact. Schedule review within the current quarter."}
                  {change.riskLevel === "low" &&
                    "Low impact. Monitor and update policies during next review cycle."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions + Checklist */}
        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {change.recommendedAction.split("\n").map((action, idx) => {
                  const cleaned = action.replace(/^\d+\.\s*/, "").trim();
                  if (!cleaned) return null;
                  return (
                    <div
                      key={idx}
                      className="flex gap-2.5 p-2.5 rounded-md bg-muted/50"
                    >
                      <span className="text-xs text-muted-foreground mt-0.5 shrink-0">
                        {idx + 1}.
                      </span>
                      <p className="text-sm text-foreground/90">{cleaned}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {change.complianceChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(idx)}
                      onChange={() => toggleChecked(idx)}
                      className="mt-0.5 rounded border-border accent-primary"
                    />
                    <span
                      className={`text-sm ${
                        checkedItems.has(idx)
                          ? "text-muted-foreground line-through"
                          : "text-foreground/90"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {checkedItems.size} of {change.complianceChecklist.length} items
                  completed
                </p>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${
                        (checkedItems.size / change.complianceChecklist.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Raw Diff */}
      <Card className="border border-border">
        <CardHeader>
          <button
            onClick={() => setDiffExpanded(!diffExpanded)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="flex items-center gap-2">
              Raw Diff
            </CardTitle>
            {diffExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {diffExpanded && (
          <CardContent>
            <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed">
                {change.rawDiff.split("\n").map((line, idx) => {
                  let color = "text-slate-400";
                  if (line.startsWith("+")) color = "text-emerald-400";
                  if (line.startsWith("-")) color = "text-red-400";
                  return (
                    <div key={idx} className={`${color}`}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
