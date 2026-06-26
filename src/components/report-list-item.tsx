import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, FileText, Upload, Building2, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { deleteReport } from "@/lib/analysis.functions";
import { toast } from "sonner";
import type { ReportRow } from "@/lib/analysis-types";
import { scoreLabel } from "@/lib/analysis-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sourceIcon: Record<string, React.ElementType> = {
  pdf: Upload,
  text: FileText,
  company: Building2,
};

function ringColor(score: number | null): string {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-credible";
  if (score >= 50) return "text-accent";
  if (score >= 25) return "text-warning";
  return "text-destructive";
}

export function ReportListItem({ report }: { report: ReportRow }) {
  const Icon = sourceIcon[report.source_type] ?? FileText;
  const failed = report.status === "failed";
  const date = new Date(report.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  
  const [isDeleting, setIsDeleting] = useState(false);
  const removeReport = useServerFn(deleteReport);
  const queryClient = useQueryClient();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete analysis for ${report.company_name}?`)) return;
    setIsDeleting(true);
    try {
      await removeReport({ data: { id: report.id } });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="group relative flex items-center gap-4 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40">
      <Link to="/reports/$id" params={{ id: report.id }} className="min-w-0 flex-1 flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{report.company_name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {failed ? "Analysis failed" : report.verdict || scoreLabel(report.credibility_score)} · {date}
          </p>
        </div>
        {failed ? (
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
        ) : (
          <span className={cn("font-display text-xl font-bold shrink-0", ringColor(report.credibility_score))}>
            {report.credibility_score ?? "—"}
          </span>
        )}
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
        title="Delete analysis"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>

      <Link to="/reports/$id" params={{ id: report.id }} className="text-muted-foreground hover:text-primary shrink-0">
        <ChevronRight className="h-5 w-5" />
      </Link>
    </Card>
  );
}
