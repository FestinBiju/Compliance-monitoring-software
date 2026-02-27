import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { sources as initialSources, statusColors } from "./mock-data";
import type { Source } from "./mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SourcesPage() {
  const [sourcesList, setSourcesList] = useState<Source[]>(initialSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
  });

  const filteredSources = sourcesList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMonitoring = (id: string) => {
    setSourcesList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, monitoring: !s.monitoring, status: !s.monitoring ? "active" : "inactive" as const }
          : s
      )
    );
  };

  const handleOpenAdd = () => {
    setEditingSource(null);
    setFormData({ name: "", url: "", category: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (source: Source) => {
    setEditingSource(source);
    setFormData({ name: source.name, url: source.url, category: source.category });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSource) {
      setSourcesList((prev) =>
        prev.map((s) =>
          s.id === editingSource.id
            ? { ...s, name: formData.name, url: formData.url, category: formData.category }
            : s
        )
      );
    } else {
      const newSource: Source = {
        id: `src-${Date.now()}`,
        name: formData.name,
        url: formData.url,
        category: formData.category,
        lastChecked: new Date().toISOString(),
        lastChanged: "Never",
        status: "active",
        monitoring: true,
      };
      setSourcesList((prev) => [...prev, newSource]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSourcesList((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Sources</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage regulatory sources being monitored
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="self-start">
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
      </div>

      {/* Search */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sources by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>
            All Sources
            <span className="ml-2 text-sm text-muted-foreground">
              ({filteredSources.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Last Checked</TableHead>
                <TableHead className="hidden lg:table-cell">Last Changed</TableHead>
                <TableHead>Monitor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => {
                const status = statusColors[source.status];
                return (
                  <TableRow key={source.id}>
                    <TableCell className="text-foreground">{source.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline max-w-[200px] truncate"
                      >
                        <span className="truncate">{new URL(source.url).hostname}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {source.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${status.bg} ${status.text} border-0 capitalize text-[11px] px-1.5 py-0`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {source.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(source.lastChecked)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {source.lastChanged === "Never"
                        ? "Never"
                        : formatDate(source.lastChanged)}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={source.monitoring}
                        onCheckedChange={() => handleToggleMonitoring(source.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(source)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(source.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredSources.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No sources found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSource ? "Edit Source" : "Add New Source"}
            </DialogTitle>
            <DialogDescription>
              {editingSource
                ? "Update the source configuration below."
                : "Enter the details for the new regulatory source."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm">Source Name</label>
              <Input
                placeholder="e.g., RBI Master Directions"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">URL</label>
              <Input
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Category</label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DPDP">DPDP</SelectItem>
                  <SelectItem value="RBI">RBI</SelectItem>
                  <SelectItem value="SEBI">SEBI</SelectItem>
                  <SelectItem value="IRDAI">IRDAI</SelectItem>
                  <SelectItem value="IT Act">IT Act</SelectItem>
                  <SelectItem value="CERT-In">CERT-In</SelectItem>
                  <SelectItem value="TRAI">TRAI</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.url || !formData.category}
            >
              {editingSource ? "Save Changes" : "Add Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
