import {
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Database,
  Cpu,
  RefreshCw,
  Wifi,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  icon: React.ElementType;
  lastCheck: string;
  responseTime: string;
  details: string;
}

const services: ServiceStatus[] = [
  {
    name: "Backend API",
    status: "operational",
    icon: Server,
    lastCheck: "2026-02-27T10:59:00Z",
    responseTime: "42ms",
    details: "All endpoints responding normally",
  },
  {
    name: "Database Connection",
    status: "operational",
    icon: Database,
    lastCheck: "2026-02-27T10:59:00Z",
    responseTime: "8ms",
    details: "PostgreSQL v15.4 - 847 records, 12.3MB",
  },
  {
    name: "Scheduler Service",
    status: "operational",
    icon: Cpu,
    lastCheck: "2026-02-27T10:58:00Z",
    responseTime: "N/A",
    details: "Next scheduled run: Feb 27, 2026, 11:00 AM",
  },
  {
    name: "Source Fetcher",
    status: "degraded",
    icon: Wifi,
    lastCheck: "2026-02-27T10:55:00Z",
    responseTime: "1,230ms",
    details: "1 source returning timeout errors (IT Act Amendments)",
  },
];

const recentJobs = [
  {
    id: "job-001",
    name: "Source Monitoring Cycle",
    status: "completed",
    startedAt: "2026-02-27T10:30:00Z",
    duration: "2m 14s",
    sourcesChecked: 7,
    changesDetected: 0,
  },
  {
    id: "job-002",
    name: "Source Monitoring Cycle",
    status: "completed",
    startedAt: "2026-02-27T09:30:00Z",
    duration: "2m 08s",
    sourcesChecked: 7,
    changesDetected: 1,
  },
  {
    id: "job-003",
    name: "AI Summary Generation",
    status: "completed",
    startedAt: "2026-02-27T09:32:00Z",
    duration: "45s",
    sourcesChecked: 1,
    changesDetected: 0,
  },
  {
    id: "job-004",
    name: "Source Monitoring Cycle",
    status: "failed",
    startedAt: "2026-02-27T08:30:00Z",
    duration: "0m 47s",
    sourcesChecked: 5,
    changesDetected: 0,
  },
  {
    id: "job-005",
    name: "Alert Dispatch",
    status: "completed",
    startedAt: "2026-02-27T09:33:00Z",
    duration: "3s",
    sourcesChecked: 0,
    changesDetected: 0,
  },
];

const statusConfig = {
  operational: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    label: "Operational",
  },
  degraded: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    label: "Degraded",
  },
  down: {
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    label: "Down",
  },
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SystemStatusPage() {
  const [refreshing, setRefreshing] = useState(false);

  const allOperational = services.every((s) => s.status === "operational");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">System Status</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Infrastructure health and monitoring diagnostics
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Overall Status Banner */}
      <Card
        className={`border ${
          allOperational ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <XCircle className="w-6 h-6 text-amber-600" />
            )}
            <div>
              <p className="text-foreground">
                {allOperational
                  ? "All Systems Operational"
                  : "Partial Service Degradation"}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: Feb 27, 2026, 10:59 AM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const config = statusConfig[service.status];
          return (
            <Card key={service.name} className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <service.icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Response: {service.responseTime}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${config.bg} ${config.color} border-0 text-[11px] px-1.5 py-0`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{service.details}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last check: {formatTime(service.lastCheck)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Recent Jobs
          </CardTitle>
          <CardDescription>Latest background job executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2 sm:w-56 shrink-0">
                  {job.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm text-foreground">{job.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatTime(job.startedAt)}</span>
                  <span>Duration: {job.duration}</span>
                  {job.sourcesChecked > 0 && (
                    <span>{job.sourcesChecked} sources checked</span>
                  )}
                  {job.changesDetected > 0 && (
                    <Badge
                      className="bg-blue-50 text-blue-700 border-0 text-[11px] px-1.5 py-0"
                    >
                      {job.changesDetected} change(s) detected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Platform Version", value: "v1.2.0" },
              { label: "Uptime", value: "14d 7h 23m" },
              { label: "Total Sources", value: "7" },
              { label: "Total Changes Tracked", value: "142" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg bg-muted/50 border border-border"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm text-foreground mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
