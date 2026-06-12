import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageSquareWarning,
  Calculator,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Quote,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { getReport, deleteReport } from "@/lib/analysis.functions";
import type { AnalysisResult } from "@/lib/analysis-types";
import { scoreLabel } from "@/lib/analysis-types";
import { ScoreGauge } from "@/components/score-gauge";
import { SeverityBadge } from "@/components/severity-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/reports/$id")({
  component: ReportPage,
  errorComponent: () => (
    <div className="py-16 text-center text-muted-foreground">Could not load this report.</div>
  ),
  notFoundComponent: () => (
    <div className="py-16 text-center text-muted-foreground">Report not found.</div>
  ),
});

function ReportPage() {
  const { id } = useParams({ from: "/_authenticated/reports/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchReport = useServerFn(getReport);
  const removeReport = useServerFn(deleteReport);

  const { data, isLoading } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => fetchReport({ data: { id } }),
  });

  const result = data?.result as AnalysisResult | null | undefined;

  const riskMeta = useMemo(() => {
    switch (data?.risk_level) {
      case "high":
        return { label: "High risk", cls: "text-destructive bg-destructive/10 border-destructive/30", Icon: AlertTriangle };
      case "medium":
        return { label: "Medium risk", cls: "text-warning bg-warning/10 border-warning/30", Icon: AlertTriangle };
      default:
        return { label: "Low risk", cls: "text-credible bg-credible/10 border-credible/30", Icon: CheckCircle2 };
    }
  }, [data?.risk_level]);

  async function handleDelete() {
    if (!confirm("Delete this analysis?")) return;
    try {
      await removeReport({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Deleted");
      navigate({ to: "/history" });
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading report…
      </div>
    );
  }

  if (!data || !result) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{data?.error || "This report has no analysis data."}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/history">Back to history</Link>
        </Button>
      </div>
    );
  }

  const RiskIcon = riskMeta.Icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/history"><ArrowLeft className="mr-2 h-4 w-4" />History</Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />Delete
        </Button>
      </div>

      {/* Header / verdict */}
      <Card className="overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex justify-center">
            <ScoreGauge score={data.credibility_score ?? result.credibilityScore} size={180} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {data.company_name} · {scoreLabel(data.credibility_score)}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{result.verdict}</h1>
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${riskMeta.cls}`}>
              <RiskIcon className="h-4 w-4" />
              {riskMeta.label}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">{result.summary}</p>
          </div>
        </div>
      </Card>

      {/* Pillar scores */}
      <div className="grid gap-4 sm:grid-cols-3">
        <PillarCard icon={MessageSquareWarning} label="Linguistic" score={result.pillarScores.linguistic} desc="Slogans & tone" />
        <PillarCard icon={Calculator} label="Quantitative" score={result.pillarScores.quantitative} desc="Numbers & anomalies" />
        <PillarCard icon={Globe} label="External" score={result.pillarScores.external} desc="Real-world context" />
      </div>

      {/* Tone */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Tone & sentiment</h2>
        <p className="mt-1 text-sm"><span className="font-medium">Detected sentiment:</span> {result.toneAnalysis.sentiment}</p>
        {result.toneAnalysis.incongruence && (
          <p className="mt-2 rounded-md bg-warning/10 p-3 text-sm text-foreground/90">
            {result.toneAnalysis.incongruence}
          </p>
        )}
      </Card>

      {/* Linguistic findings */}
      {result.linguisticFindings.length > 0 && (
        <Card className="p-6">
          <SectionTitle icon={MessageSquareWarning} title="Flagged language" count={result.linguisticFindings.length} />
          <div className="mt-4 space-y-4">
            {result.linguisticFindings.map((f, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold">{f.issue}</span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <blockquote className="flex gap-2 border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
                  <Quote className="h-4 w-4 shrink-0 text-primary/60" />
                  {f.quote}
                </blockquote>
                <p className="mt-2 text-sm text-foreground/90">{f.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quantitative findings */}
      {result.quantitativeFindings.length > 0 && (
        <Card className="p-6">
          <SectionTitle icon={Calculator} title="Quantitative anomalies" count={result.quantitativeFindings.length} />
          <div className="mt-4 space-y-4">
            {result.quantitativeFindings.map((f, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold">{f.metric}</span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-sm"><span className="font-medium">Claim:</span> {f.claim}</p>
                <p className="mt-1 text-sm text-foreground/90"><span className="font-medium">Concern:</span> {f.concern}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* External findings */}
      {result.externalFindings.length > 0 && (
        <Card className="p-6">
          <SectionTitle icon={Globe} title="External triangulation" count={result.externalFindings.length} />
          <div className="mt-4 space-y-4">
            {result.externalFindings.map((f, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold">{f.claim}</span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-sm"><span className="font-medium">Context:</span> {f.externalContext}</p>
                <p className="mt-1 text-sm text-destructive/90"><span className="font-medium">Contradiction:</span> {f.contradiction}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Claims columns */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="flex items-center gap-2 font-display font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" /> Vague / empty claims
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {result.vagueClaims.length ? result.vagueClaims.map((c, i) => (
              <li key={i} className="flex gap-2"><span className="text-destructive">•</span>{c}</li>
            )) : <li className="text-muted-foreground">None detected.</li>}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="flex items-center gap-2 font-display font-semibold text-credible">
            <CheckCircle2 className="h-4 w-4" /> Concrete commitments
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {result.concreteCommitments.length ? result.concreteCommitments.map((c, i) => (
              <li key={i} className="flex gap-2"><span className="text-credible">•</span>{c}</li>
            )) : <li className="text-muted-foreground">None detected.</li>}
          </ul>
        </Card>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card className="p-6">
          <SectionTitle icon={Lightbulb} title="Auditor recommendations" count={result.recommendations.length} />
          <ul className="mt-4 space-y-2 text-sm">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{r}</li>
            ))}
          </ul>
        </Card>
      )}

      <p className="pb-4 text-center text-xs text-muted-foreground">
        AI-generated forensic assessment. Findings are indicators for human review, not legal conclusions.
      </p>
    </div>
  );
}

function PillarCard({ icon: Icon, label, score, desc }: { icon: React.ElementType; label: string; score: number; desc: string }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <ScoreGauge score={score} size={72} label="" />
      <div>
        <div className="flex items-center gap-1.5 font-semibold">
          <Icon className="h-4 w-4 text-primary" />{label}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{count}</span>
    </div>
  );
}
