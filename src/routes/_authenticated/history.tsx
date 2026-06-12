import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, FileSearch } from "lucide-react";
import { listReports } from "@/lib/analysis.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportListItem } from "@/components/report-list-item";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const fetchReports = useServerFn(listReports);
  const { data, isLoading } = useQuery({ queryKey: ["reports"], queryFn: () => fetchReports() });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Analysis history</h1>
          <p className="mt-1 text-muted-foreground">All your past forensic CSR analyses.</p>
        </div>
        <Button asChild><Link to="/analyze">New analysis</Link></Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (data ?? []).length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <FileSearch className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No analyses yet.</p>
          <Button asChild><Link to="/analyze">Analyze a report</Link></Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {data!.map((r) => <ReportListItem key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
