import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DjOZMqFS.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import { u as useAuth } from "./use-auth-Cfr24KXP.mjs";
import { h as heroImage } from "./router-Dqku9KSM.mjs";
import "../_libs/sonner.mjs";
import { L as LeafyGreen, S as ScanSearch, A as ArrowRight, M as MessageSquareWarning, C as Calculator, G as Globe, F as FileSearch, B as Brain, d as ShieldCheck, e as CircleCheck } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./client-BuMxJlfI.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const pillars = [{
  icon: MessageSquareWarning,
  title: "Semantic dissection",
  body: "Contextual NLP separates concrete, measurable goals from empty slogans and flags tone–sentiment incongruence around known controversies."
}, {
  icon: Calculator,
  title: "Anomaly detection",
  body: "Scrutinizes reported metrics — emissions, water, waste, spend — for statistical impossibilities and shifting baselines."
}, {
  icon: Globe,
  title: "External triangulation",
  body: "Cross-references claims against real-world context: controversies, fines, and reporting credibility signals."
}];
const steps = [{
  icon: FileSearch,
  title: "Upload or paste",
  body: "Drop a CSR/ESG PDF or paste report text to begin the analysis."
}, {
  icon: Brain,
  title: "AI runs forensics",
  body: "Three analytical pillars score credibility and surface flagged passages."
}, {
  icon: ShieldCheck,
  title: "Review the verdict",
  body: "Get a credibility score, risk level, and an evidence trail for human review."
}];
function Landing() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/dashboard",
      replace: true
    });
  }, [user, loading, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeafyGreen, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: "VeritasESG" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Sign in" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScanSearch, { className: "h-3.5 w-3.5 text-primary" }),
          " AI Forensic Accounting · ESG"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 font-display text-4xl font-bold leading-[1.1] md:text-5xl", children: [
          "Beyond green claims.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: " Detect greenwashing with AI." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-md text-lg text-muted-foreground", children: "VeritasESG reads CSR & sustainability reports the way a forensic auditor would — exposing vague slogans, statistical anomalies, and contradictions in seconds." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", children: [
            "Start analyzing ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", children: "See how it works" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImage, alt: "AI magnifying lens scanning a corporate sustainability report for greenwashing", width: 1280, height: 960, className: "rounded-2xl shadow-soft" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold", children: "Three pillars of forensic analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Traditional audits focus on numbers. VeritasESG analyzes the narrative, the data, and the real world — together." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: pillars.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 transition-shadow hover:shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-xl font-semibold", children: p.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: p.body })
      ] }, p.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how", className: "bg-secondary/40 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold", children: "How it works" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "From document to verdict in three steps." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero font-display text-sm font-bold text-primary-foreground", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-lg font-semibold", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: s.body })
      ] }, s.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-4 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-soft md:p-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold md:text-4xl", children: "Hold companies accountable." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-primary-foreground/90", children: "Bring proactive, semantic-level forensics to your ESG reviews. Free to start." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/90", children: ["Credibility scoring", "Flagged passages", "Anomaly detection", "Saved history"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
        f
      ] }, f)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "secondary", className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", children: [
        "Create free account ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LeafyGreen, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground", children: "VeritasESG" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "AI-enhanced forensic accounting for sustainable reporting." })
    ] }) })
  ] });
}
export {
  Landing as component
};
