import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useParams, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, d as deleteReport, b as getReport } from "./analysis.functions-CfEQkwuk.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as scoreLabel } from "./analysis-types-BYuhjYc1.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import "../_libs/seroval.mjs";
import { e as CircleCheck, l as TriangleAlert, a as LoaderCircle, m as ArrowLeft, T as Trash2, M as MessageSquareWarning, C as Calculator, G as Globe, Q as Quote, n as Lightbulb } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-l6MQaq9U.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CnHkFP9V.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function scoreColor(score) {
  if (score >= 75) return "var(--credible)";
  if (score >= 50) return "var(--accent)";
  if (score >= 25) return "var(--warning)";
  return "var(--destructive)";
}
function ScoreGauge({ score, size = 160, label = "Credibility", className }) {
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - clamped / 100 * circumference;
  const color = scoreColor(clamped);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative inline-flex items-center justify-center", className), style: { width: size, height: size }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: "var(--muted)",
          strokeWidth: stroke
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: color,
          strokeWidth: stroke,
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          style: { transition: "stroke-dashoffset 1s ease-out" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold", style: { color }, children: Math.round(clamped) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label })
    ] })
  ] });
}
const styles = {
  low: "bg-credible/15 text-credible border-credible/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30"
};
function SeverityBadge({ severity, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[severity] ?? "bg-muted text-muted-foreground border-border",
        className
      ),
      children: severity
    }
  );
}
function ReportPage() {
  const {
    id
  } = useParams({
    from: "/_authenticated/reports/$id"
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchReport = useServerFn(getReport);
  const removeReport = useServerFn(deleteReport);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => fetchReport({
      data: {
        id
      }
    })
  });
  const result = data?.result;
  const riskMeta = reactExports.useMemo(() => {
    switch (data?.risk_level) {
      case "high":
        return {
          label: "High risk",
          cls: "text-destructive bg-destructive/10 border-destructive/30",
          Icon: TriangleAlert
        };
      case "medium":
        return {
          label: "Medium risk",
          cls: "text-warning bg-warning/10 border-warning/30",
          Icon: TriangleAlert
        };
      default:
        return {
          label: "Low risk",
          cls: "text-credible bg-credible/10 border-credible/30",
          Icon: CircleCheck
        };
    }
  }, [data?.risk_level]);
  async function handleDelete() {
    if (!confirm("Delete this analysis?")) return;
    try {
      await removeReport({
        data: {
          id
        }
      });
      queryClient.invalidateQueries({
        queryKey: ["reports"]
      });
      queryClient.invalidateQueries({
        queryKey: ["stats"]
      });
      toast.success("Deleted");
      navigate({
        to: "/history"
      });
    } catch {
      toast.error("Failed to delete");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
      " Loading report…"
    ] });
  }
  if (!data || !result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: data?.error || "This report has no analysis data." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/history", children: "Back to history" }) })
    ] });
  }
  const RiskIcon = riskMeta.Icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "History"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: handleDelete, className: "text-destructive hover:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
        "Delete"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreGauge, { score: data.credibility_score ?? result.credibilityScore, size: 180 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium uppercase tracking-wide text-muted-foreground", children: [
          data.company_name,
          " · ",
          scoreLabel(data.credibility_score)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-2xl font-bold md:text-3xl", children: result.verdict }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${riskMeta.cls}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RiskIcon, { className: "h-4 w-4" }),
          riskMeta.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-relaxed text-foreground/90", children: result.summary })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PillarCard, { icon: MessageSquareWarning, label: "Linguistic", score: result.pillarScores.linguistic, desc: "Slogans & tone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PillarCard, { icon: Calculator, label: "Quantitative", score: result.pillarScores.quantitative, desc: "Numbers & anomalies" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PillarCard, { icon: Globe, label: "External", score: result.pillarScores.external, desc: "Real-world context" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Tone & sentiment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Detected sentiment:" }),
        " ",
        result.toneAnalysis.sentiment
      ] }),
      result.toneAnalysis.incongruence && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 rounded-md bg-warning/10 p-3 text-sm text-foreground/90", children: result.toneAnalysis.incongruence })
    ] }),
    result.linguisticFindings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: MessageSquareWarning, title: "Flagged language", count: result.linguisticFindings.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: result.linguisticFindings.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: f.issue }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: f.severity })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "flex gap-2 border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "h-4 w-4 shrink-0 text-primary/60" }),
          f.quote
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/90", children: f.explanation })
      ] }, i)) })
    ] }),
    result.quantitativeFindings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Calculator, title: "Quantitative anomalies", count: result.quantitativeFindings.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: result.quantitativeFindings.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: f.metric }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: f.severity })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Claim:" }),
          " ",
          f.claim
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-foreground/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Concern:" }),
          " ",
          f.concern
        ] })
      ] }, i)) })
    ] }),
    result.externalFindings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Globe, title: "External triangulation", count: result.externalFindings.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: result.externalFindings.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: f.claim }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: f.severity })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Context:" }),
          " ",
          f.externalContext
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-destructive/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Contradiction:" }),
          " ",
          f.contradiction
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 font-display font-semibold text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          " Vague / empty claims"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm", children: result.vagueClaims.length ? result.vagueClaims.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "•" }),
          c
        ] }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "None detected." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 font-display font-semibold text-credible", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          " Concrete commitments"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm", children: result.concreteCommitments.length ? result.concreteCommitments.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-credible", children: "•" }),
          c
        ] }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "None detected." }) })
      ] })
    ] }),
    result.recommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Lightbulb, title: "Auditor recommendations", count: result.recommendations.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2 text-sm", children: result.recommendations.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
        r
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pb-4 text-center text-xs text-muted-foreground", children: "AI-generated forensic assessment. Findings are indicators for human review, not legal conclusions." })
  ] });
}
function PillarCard({
  icon: Icon,
  label,
  score,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreGauge, { score, size: 72, label: "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
        label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
    ] })
  ] });
}
function SectionTitle({
  icon: Icon,
  title,
  count
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground", children: count })
  ] });
}
export {
  ReportPage as component
};
