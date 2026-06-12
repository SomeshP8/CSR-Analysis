import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Upload, Building2, Loader2, ScanSearch, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeReport } from "@/lib/analysis.functions";
import { extractPdfText } from "@/lib/pdf-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/analyze")({
  component: AnalyzePage,
});

type Tab = "pdf" | "text" | "company";

function AnalyzePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const analyze = useServerFn(analyzeReport);
  const [tab, setTab] = useState<Tab>("pdf");
  const [company, setCompany] = useState("");
  const [text, setText] = useState("");
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");

  const mutation = useMutation({
    mutationFn: (vars: { companyName?: string; text: string; sourceType: Tab }) =>
      analyze({ data: vars }),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Analysis complete");
      navigate({ to: "/reports/$id", params: { id: row.id } });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Analysis failed"),
  });

  async function handleFile(file: File) {
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
    if (tab === "company") {
      if (company.trim().length < 2) return toast.error("Enter a company name.");
      mutation.mutate({
        companyName: company.trim(),
        sourceType: "company",
        text: `Provide a forensic greenwashing assessment of the most recent publicly known CSR/ESG positioning of the company "${company.trim()}". Base the analysis on widely reported sustainability claims, commitments, controversies, fines, and credibility signals associated with this company. Clearly note this assessment is derived from general knowledge rather than a specific uploaded document.`,
      });
      return;
    }
    const content = tab === "pdf" ? pdfText : text;
    if (content.trim().length < 50) {
      return toast.error("Provide at least 50 characters of report text.");
    }
    mutation.mutate({ companyName: company.trim() || undefined, sourceType: tab, text: content });
  }

  const busy = mutation.isPending;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Analyze a report</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a CSR/ESG report, paste its text, or look up a company. The AI runs semantic,
          quantitative, and external-context analysis.
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-5 space-y-2">
          <Label htmlFor="company">Company name {tab !== "company" && <span className="text-muted-foreground">(optional)</span>}</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="company" className="pl-9" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Acme Energy Corp" />
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf"><Upload className="mr-1.5 h-4 w-4" />PDF</TabsTrigger>
            <TabsTrigger value="text"><FileText className="mr-1.5 h-4 w-4" />Text</TabsTrigger>
            <TabsTrigger value="company"><Building2 className="mr-1.5 h-4 w-4" />Company</TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-primary/50">
              <Upload className="h-8 w-8 text-primary" />
              <span className="font-medium">{fileName || "Click to upload a PDF report"}</span>
              <span className="text-xs text-muted-foreground">Text-based PDFs only · up to ~50 pages</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
            {pdfStatus && <p className="mt-3 text-sm text-muted-foreground">{pdfStatus}</p>}
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the CSR / sustainability report text here…"
              className="min-h-[220px] resize-y"
            />
            <p className="mt-2 text-xs text-muted-foreground">{text.length.toLocaleString()} characters</p>
          </TabsContent>

          <TabsContent value="company" className="mt-4">
            <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              <Sparkles className="mb-2 h-5 w-5 text-accent" />
              Enter a company name above and the AI will assess its publicly known sustainability
              claims and credibility signals from general knowledge.
            </div>
          </TabsContent>
        </Tabs>

        <Button className="mt-6 w-full" size="lg" onClick={submit} disabled={busy}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
          {busy ? "Running forensic analysis…" : "Run forensic analysis"}
        </Button>
      </Card>
    </div>
  );
}
