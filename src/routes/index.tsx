import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  LeafyGreen,
  ScanSearch,
  MessageSquareWarning,
  Calculator,
  Globe,
  ShieldCheck,
  ArrowRight,
  FileSearch,
  Brain,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeritasESG — AI Greenwashing Detection for CSR Reports" },
      {
        name: "description",
        content:
          "AI forensic auditing that detects greenwashing in CSR & ESG reports using semantic analysis, anomaly detection, and external triangulation. Get a credibility score in seconds.",
      },
      { property: "og:title", content: "VeritasESG — AI Greenwashing Detection" },
      {
        property: "og:description",
        content: "Upload any CSR report and get a forensic credibility score with flagged claims and anomalies.",
      },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: Landing,
});

const pillars = [
  {
    icon: MessageSquareWarning,
    title: "Semantic dissection",
    body: "Contextual NLP separates concrete, measurable goals from empty slogans and flags tone–sentiment incongruence around known controversies.",
  },
  {
    icon: Calculator,
    title: "Anomaly detection",
    body: "Scrutinizes reported metrics — emissions, water, waste, spend — for statistical impossibilities and shifting baselines.",
  },
  {
    icon: Globe,
    title: "External triangulation",
    body: "Cross-references claims against real-world context: controversies, fines, and reporting credibility signals.",
  },
];

const steps = [
  { icon: FileSearch, title: "Upload or paste", body: "Drop a CSR/ESG PDF or paste report text to begin the analysis." },
  { icon: Brain, title: "AI runs forensics", body: "Three analytical pillars score credibility and surface flagged passages." },
  { icon: ShieldCheck, title: "Review the verdict", body: "Get a credibility score, risk level, and an evidence trail for human review." },
];

function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
            <LeafyGreen className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">VeritasESG</span>
        </div>
        <Button asChild size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="bg-gradient-subtle">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ScanSearch className="h-3.5 w-3.5 text-primary" /> AI Forensic Accounting · ESG
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] md:text-5xl">
              Beyond green claims.
              <span className="text-gradient"> Detect greenwashing with AI.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              VeritasESG reads CSR & sustainability reports the way a forensic auditor would — exposing
              vague slogans, statistical anomalies, and contradictions in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/auth">Start analyzing <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">See how it works</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="AI magnifying lens scanning a corporate sustainability report for greenwashing"
              width={1280}
              height={960}
              className="rounded-2xl shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">Three pillars of forensic analysis</h2>
          <p className="mt-3 text-muted-foreground">
            Traditional audits focus on numbers. VeritasESG analyzes the narrative, the data, and the
            real world — together.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title} className="p-6 transition-shadow hover:shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">How it works</h2>
            <p className="mt-3 text-muted-foreground">From document to verdict in three steps.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-soft md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Hold companies accountable.</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Bring proactive, semantic-level forensics to your ESG reviews. Free to start.
          </p>
          <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/90">
            {["Credibility scoring", "Flagged passages", "Anomaly detection", "Saved history"].map((f) => (
              <li key={f} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" />{f}</li>
            ))}
          </ul>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/auth">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <LeafyGreen className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">VeritasESG</span>
          </div>
          <p>AI-enhanced forensic accounting for sustainable reporting.</p>
        </div>
      </footer>
    </div>
  );
}
