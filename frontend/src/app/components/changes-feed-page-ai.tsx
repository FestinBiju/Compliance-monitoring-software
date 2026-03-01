import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Filter, Calendar, Search, Sparkles, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { riskColors } from "./mock-data";
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

interface AnalysisResult {
  applicable: boolean;
  risk_level: string;
  affected_obligation_id: string;
  summary: string;
  tasks: Array<{
    title: string;
    priority: string;
    deadline_days: number;
  }>;
  reasoning_steps: string[];
  retrieved_obligation: {
    id: string;
    title: string;
    description: string;
  };
}

export function ChangesFeedPage() {
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { data: changesData, loading: changesLoading } = useApi(
    () => api.getChanges(1, 50),
    []
  );

  const changes = changesData?.changes || [];

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

  const handleAnalyze = async () => {
    if (!updateText.trim()) return;

    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/analyze-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ update_text: updateText }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setUpdateText("");
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with AI Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Changes Feed</h1>
          <p className="text-sm text-muted-foreground">
            Real-time log of detected regulatory changes
          </p>
        </div>
        
        <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              Analyze with AI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Compliance Analysis
              </DialogTitle>
              <DialogDescription>
                Paste a regulatory update to get AI-powered compliance insights
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {!analysisResult ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Regulatory Update Text
                    </label>
                    <Textarea
                      placeholder="Paste the regulatory update text here..."
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  {analysisError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      {analysisError}
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing || !updateText.trim()}
                    className="w-full"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <AnalysisResults result={analysisResult} onReset={resetAnalysis} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search changes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <div className="flex gap-3">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[160px] h-11">
                  <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
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
                <SelectTrigger className="w-[180px] h-11">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="meity">MeitY Press Releases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {changesLoading ? (
            "Loading changes..."
          ) : (
            `Showing ${filteredChanges.length} of ${changes.length} changes`
          )}
        </p>
      </div>

      {/* Loading State */}
      {changesLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Changes Cards */}
      {!changesLoading && (
        <div className="space-y-3">
          {filteredChanges.map((change) => {
            const risk = riskColors[change.riskLevel as RiskLevel];
            return (
              <Card
                key={change.id}
                className="border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {change.sourceName}
                        </span>
                        <Badge
                          className={`${risk.bg} ${risk.text} border-0 capitalize text-[11px] px-2 py-0.5 font-medium`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.dot} mr-1`} />
                          {change.riskLevel}
                        </Badge>
                        <Badge variant="secondary" className="text-[11px] px-2 py-0.5 font-medium">
                          {change.affectedSector.split(",")[0]}
                        </Badge>
                        {change.ai_analysis && (
                          <Badge className="bg-purple-100 text-purple-800 border-0 text-[11px] px-2 py-0.5 font-medium">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Analyzed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {change.changeSummary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3 h-3" />
                          {formatDate(change.detectedAt)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/changes/${change.id}`} className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!changesLoading && filteredChanges.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            No changes match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}

function AnalysisResults({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const riskColors = {
    Low: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
    Medium: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
    High: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    Critical: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  };

  const risk = riskColors[result.risk_level as keyof typeof riskColors] || riskColors.Medium;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analysis Results</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="w-4 h-4 mr-1" />
          New Analysis
        </Button>
      </div>

      {/* Summary */}
      <Card className={`border-2 ${risk.border}`}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-3">
            <Badge className={`${risk.bg} ${risk.text} border-0`}>
              {result.risk_level} Risk
            </Badge>
            <Badge variant={result.applicable ? "default" : "secondary"}>
              {result.applicable ? "Applicable" : "Not Applicable"}
            </Badge>
          </div>
          <p className="text-sm">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Affected Obligation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Affected Obligation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{result.affected_obligation_id}</Badge>
              <span className="text-sm font-medium">
                {result.retrieved_obligation?.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {result.retrieved_obligation?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recommended Actions ({result.tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {result.tasks.map((task, index) => (
              <div key={index} className="p-3 border rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.deadline_days} days
                  </span>
                </div>
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reasoning */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">AI Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {result.reasoning_steps.map((step, index) => (
              <li key={index} className="flex gap-2 text-xs">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
