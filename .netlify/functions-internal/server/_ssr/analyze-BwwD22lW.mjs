import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, a as analyzeReport } from "./analysis.functions-CfEQkwuk.mjs";
import { u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { L as Label, I as Input, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-Cmw4_Ft8.mjs";
import { C as Card } from "./card-BtiUI6Md.mjs";
import "../_libs/seroval.mjs";
import { h as Building2, U as Upload, i as FileText, a as LoaderCircle, S as ScanSearch } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
async function extractPdfText(file, onProgress) {
  const pdfjs = await import("../_libs/pdfjs-dist.mjs");
  const workerUrl = (await import("./pdf.worker.min-frB0deQB.mjs")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const parts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => "str" in item ? item.str : "").join(" ");
    parts.push(text);
    onProgress?.(i, doc.numPages);
  }
  await doc.cleanup();
  return parts.join("\n\n").replace(/\s+\n/g, "\n").trim();
}
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function AnalyzePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const analyze = useServerFn(analyzeReport);
  const [tab, setTab] = reactExports.useState("pdf");
  const [company, setCompany] = reactExports.useState("");
  const [text, setText] = reactExports.useState("");
  const [pdfStatus, setPdfStatus] = reactExports.useState(null);
  const [pdfText, setPdfText] = reactExports.useState("");
  const [fileName, setFileName] = reactExports.useState("");
  const mutation = useMutation({
    mutationFn: (vars) => analyze({
      data: vars
    }),
    onSuccess: (row) => {
      queryClient.invalidateQueries({
        queryKey: ["reports"]
      });
      queryClient.invalidateQueries({
        queryKey: ["stats"]
      });
      toast.success("Analysis complete");
      navigate({
        to: "/reports/$id",
        params: {
          id: row.id
        }
      });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Analysis failed")
  });
  async function handleFile(file) {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setPdfStatus("Reading PDF…");
    try {
      const extracted = await extractPdfText(file, (p, t) => setPdfStatus(`Extracting page ${p} of ${t}…`));
      if (extracted.length < 50) {
        setPdfStatus(null);
        toast.error("Couldn't extract enough text. This PDF may be scanned/image-based.");
        return;
      }
      setPdfText(extracted);
      setPdfStatus(`Extracted ${extracted.length.toLocaleString()} characters from ${file.name}.`);
      if (!company) {
        const guess = file.name.replace(/[_-]+/g, " ").replace(/\.pdf$/i, "").replace(/\b(csr|esg|sustainability|report|\d{4})\b/gi, "").trim();
        if (guess) setCompany(guess);
      }
    } catch {
      setPdfStatus(null);
      toast.error("Failed to read PDF.");
    }
  }
  function submit() {
    const content = tab === "pdf" ? pdfText : text;
    if (content.trim().length < 50) {
      return toast.error("Provide at least 50 characters of report text.");
    }
    mutation.mutate({
      companyName: company.trim() || void 0,
      sourceType: tab,
      text: content
    });
  }
  const busy = mutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Analyze a report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Upload a CSR/ESG report or paste its text. The AI runs semantic, quantitative, and external-context analysis." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "company", children: [
          "Company name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "company", className: "pl-9", value: company, onChange: (e) => setCompany(e.target.value), placeholder: "e.g. Acme Energy Corp" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pdf", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-1.5 h-4 w-4" }),
            "PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "text", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1.5 h-4 w-4" }),
            "Text"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "pdf", className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-primary/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: fileName || "Click to upload a PDF report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Text-based PDFs only · up to ~50 pages" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "application/pdf", className: "hidden", onChange: (e) => e.target.files?.[0] && handleFile(e.target.files[0]) })
          ] }),
          pdfStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: pdfStatus })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "text", className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: text, onChange: (e) => setText(e.target.value), placeholder: "Paste the CSR / sustainability report text here…", className: "min-h-[220px] resize-y" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
            text.length.toLocaleString(),
            " characters"
          ] })
        ] }),
        "        "
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-6 w-full", size: "lg", onClick: submit, disabled: busy, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScanSearch, { className: "mr-2 h-4 w-4" }),
        busy ? "Running forensic analysis…" : "Run forensic analysis"
      ] })
    ] })
  ] });
}
export {
  AnalyzePage as component
};
