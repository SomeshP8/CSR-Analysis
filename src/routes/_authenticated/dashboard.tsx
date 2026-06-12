import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ScanSearch, FileSearch, ShieldAlert, Gauge, ArrowRight } from "lucide-react";
import { listReports, getStats } from "@/lib/analysis.functions";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportListItem } from "@/components/report-list-item";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const fetchReports = useServerFn(listReports);
  const fetchStats = useServerFn(getStats);

  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats() });
  const { data: reports } = useQuery({ queryKey: ["reports"], queryFn: () => fetchReports() });

  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "there";
  const recent = (reports ?? []).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-hero p-8 text-primary-foreground shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-primary-foreground/80">Welcome back, {name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Forensic CSR analysis</h1>
          <p className="mt-2 max-w-md text-sm text-primary-foreground/90">
            Detect greenwashing and irregularities in sustainability reports with AI.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="shrink-0">
          <Link to="/analyze"><ScanSearch className="mr-2 h-5 w-5" />New analysis</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileSearch} label="Reports analyzed" value={stats?.total ?? 0} />
        <StatCard icon={Gauge} label="Avg. credibility" value={stats ? `${stats.avg}/100` : "—"} />
        <StatCard icon={ShieldAlert} label="High-risk flagged" value={stats?.highRisk ?? 0} accent="destructive" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent analyses</h2>
          {recent.length > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/history">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          )}
        </div>
        {recent.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <FileSearch className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No reports yet. Run your first forensic analysis.</p>
            <Button asChild><Link to="/analyze">Analyze a report</Link></Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {recent.map((r) => <ReportListItem key={r.id} report={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent?: "destructive" }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
