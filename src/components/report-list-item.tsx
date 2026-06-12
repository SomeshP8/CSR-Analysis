import { Link } from "@tanstack/react-router";
import { ChevronRight, FileText, Upload, Building2, AlertCircle } from "lucide-react";
import type { ReportRow } from "@/lib/analysis-types";
import { scoreLabel } from "@/lib/analysis-types";
import { Card } from "@/components/ui/card";
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

  return (
    <Link to="/reports/$id" params={{ id: report.id }}>
      <Card className="flex items-center gap-4 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{report.company_name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {failed ? "Analysis failed" : report.verdict || scoreLabel(report.credibility_score)} · {date}
          </p>
        </div>
        {failed ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <span className={cn("font-display text-xl font-bold", ringColor(report.credibility_score))}>
            {report.credibility_score ?? "—"}
          </span>
        )}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Card>
    </Link>
  );
}
