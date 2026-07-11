import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, l as listReports, g as getStats } from "./analysis.functions-R56fSK8q.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth } from "./use-auth-Cfr24KXP.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { R as ReportListItem } from "./report-list-item-KjGoH3ea.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { S as ScanSearch, F as FileSearch, f as Gauge, g as ShieldAlert, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "./server-w3ftRwoN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CkSGFcSl.mjs";
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
import "./client-BuMxJlfI.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./analysis-types-BYuhjYc1.mjs";
function DashboardPage() {
  const {
    user
  } = useAuth();
  const fetchReports = useServerFn(listReports);
  const fetchStats = useServerFn(getStats);
  const {
    data: stats
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchStats()
  });
  const {
    data: reports
  } = useQuery({
    queryKey: ["reports"],
    queryFn: () => fetchReports()
  });
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "there";
  const recent = (reports ?? []).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 rounded-2xl bg-gradient-hero p-8 text-primary-foreground shadow-soft sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary-foreground/80", children: [
          "Welcome back, ",
          name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-bold", children: "Forensic CSR analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-md text-sm text-primary-foreground/90", children: "Detect greenwashing and irregularities in sustainability reports with AI." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "secondary", className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/analyze", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanSearch, { className: "mr-2 h-5 w-5" }),
        "New analysis"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: FileSearch, label: "Reports analyzed", value: stats?.total ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Gauge, label: "Avg. credibility", value: stats ? `${stats.avg}/100` : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: ShieldAlert, label: "High-risk flagged", value: stats?.highRisk ?? 0, accent: "destructive" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Recent analyses" }),
        recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", children: [
          "View all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] }),
      recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col items-center justify-center gap-3 p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "h-10 w-10 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No reports yet. Run your first forensic analysis." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/analyze", children: "Analyze a report" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recent.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReportListItem, { report: r }, r.id)) })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-4 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex h-11 w-11 items-center justify-center rounded-lg ${accent === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] });
}
export {
  DashboardPage as component
};
