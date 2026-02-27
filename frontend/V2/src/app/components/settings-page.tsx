import { useState } from "react";
import { Mail, MessageSquare, Bell, Send, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export function SettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [emailAddress, setEmailAddress] = useState("compliance@company.com");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [riskThreshold, setRiskThreshold] = useState("high");
  const [digestFrequency, setDigestFrequency] = useState("daily");

  const handleTestNotification = () => {
    toast.success("Test notification sent successfully", {
      description: "Check your configured channels for the test message.",
    });
  };

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <Toaster />

      {/* Header */}
      <div>
        <h1 className="text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure alerts, notifications, and monitoring preferences
        </p>
      </div>

      {/* Notification Channels */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose how you want to receive compliance alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="p-2 rounded-lg bg-blue-50">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Email Alerts</p>
                <p className="text-xs text-muted-foreground">Direct to inbox</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Enable email notifications</label>
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
              {emailEnabled && (
                <Input
                  placeholder="Email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Slack */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="p-2 rounded-lg bg-purple-50">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Slack Webhook</p>
                <p className="text-xs text-muted-foreground">Channel alerts</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Enable Slack notifications</label>
                <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
              </div>
              {slackEnabled && (
                <Input
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Telegram */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="p-2 rounded-lg bg-sky-50">
                <Send className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">Telegram</p>
                <p className="text-xs text-muted-foreground">Bot notifications</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Enable Telegram notifications</label>
                <Switch
                  checked={telegramEnabled}
                  onCheckedChange={setTelegramEnabled}
                />
              </div>
              {telegramEnabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Bot Token"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                  />
                  <Input
                    placeholder="Chat ID"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Preferences */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Alert Preferences
          </CardTitle>
          <CardDescription>
            Set the minimum risk level that triggers an alert
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">Risk Threshold</label>
              <Select value={riskThreshold} onValueChange={setRiskThreshold}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Low and above (All alerts)
                  </SelectItem>
                  <SelectItem value="medium">Medium and above</SelectItem>
                  <SelectItem value="high">High and above</SelectItem>
                  <SelectItem value="critical">Critical only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                You will receive alerts for changes at or above this risk level
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Digest Frequency</label>
              <Select value={digestFrequency} onValueChange={setDigestFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly digest</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly digest</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often you receive bundled notification summaries
              </p>
            </div>
          </div>

          {/* Current Config Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-foreground mb-2">Current Configuration</p>
            <div className="flex flex-wrap gap-2">
              {emailEnabled && (
                <Badge variant="secondary" className="text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Badge>
              )}
              {slackEnabled && (
                <Badge variant="secondary" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Slack
                </Badge>
              )}
              {telegramEnabled && (
                <Badge variant="secondary" className="text-xs">
                  <Send className="w-3 h-3 mr-1" />
                  Telegram
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs capitalize">
                Threshold: {riskThreshold}+
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {digestFrequency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" onClick={handleTestNotification}>
          <Send className="w-4 h-4" />
          Send Test Notification
        </Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
