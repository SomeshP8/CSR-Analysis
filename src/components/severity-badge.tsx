import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/analysis-types";

const styles: Record<string, string> = {
  low: "bg-credible/15 text-credible border-credible/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
};

export function SeverityBadge({ severity, className }: { severity: Severity | string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[severity] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {severity}
    </span>
  );
}
