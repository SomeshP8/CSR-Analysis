import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, d as useNavigate, e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BuMxJlfI.mjs";
import { c as cn, B as Button } from "./button-DjOZMqFS.mjs";
import { L as LeafyGreen, b as LayoutDashboard, S as ScanSearch, H as History, c as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanSearch },
  { to: "/history", label: "History", icon: History }
];
function AppNav() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeafyGreen, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: "VeritasESG" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-1 sm:flex", children: links.map(({ to, label, icon: Icon }) => {
        const active = pathname.startsWith(to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to,
            className: cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              label
            ]
          },
          to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: signOut, className: "text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        "Sign out"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center justify-around border-t border-border px-2 py-1 sm:hidden", children: links.map(({ to, label, icon: Icon }) => {
      const active = pathname.startsWith(to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          className: cn(
            "flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-xs font-medium",
            active ? "text-primary" : "text-muted-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            label
          ]
        },
        to
      );
    }) })
  ] });
}
function AuthenticatedLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-6xl px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AuthenticatedLayout as component
};
