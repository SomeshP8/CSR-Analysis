import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, d as deleteReport } from "./analysis.functions-R56fSK8q.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as scoreLabel } from "./analysis-types-BYuhjYc1.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { c as cn, B as Button } from "./button-DjOZMqFS.mjs";
import { h as Building2, i as FileText, U as Upload, j as CircleAlert, a as LoaderCircle, T as Trash2, k as ChevronRight } from "../_libs/lucide-react.mjs";
const sourceIcon = {
  pdf: Upload,
  text: FileText,
  company: Building2
};
function ringColor(score) {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-credible";
  if (score >= 50) return "text-accent";
  if (score >= 25) return "text-warning";
  return "text-destructive";
}
function ReportListItem({ report }) {
  const Icon = sourceIcon[report.source_type] ?? FileText;
  const failed = report.status === "failed";
  const date = new Date(report.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const removeReport = useServerFn(deleteReport);
  const queryClient = useQueryClient();
  async function handleDelete(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative flex items-center gap-4 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/reports/$id", params: { id: report.id }, className: "min-w-0 flex-1 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-semibold", children: report.company_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm text-muted-foreground", children: [
          failed ? "Analysis failed" : report.verdict || scoreLabel(report.credibility_score),
          " · ",
          date
        ] })
      ] }),
      failed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 shrink-0 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-display text-xl font-bold shrink-0", ringColor(report.credibility_score)), children: report.credibility_score ?? "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: handleDelete,
        disabled: isDeleting,
        className: "h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0",
        title: "Delete analysis",
        children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports/$id", params: { id: report.id }, className: "text-muted-foreground hover:text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" }) })
  ] });
}
export {
  ReportListItem as R
};
