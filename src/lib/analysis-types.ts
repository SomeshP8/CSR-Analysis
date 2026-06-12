// Shared, client-safe types for CSR analysis results.

export type Severity = "low" | "medium" | "high";
export type RiskLevel = "low" | "medium" | "high";

export interface LinguisticFinding {
  quote: string;
  issue: string;
  severity: Severity;
  explanation: string;
}

export interface QuantitativeFinding {
  metric: string;
  claim: string;
  concern: string;
  severity: Severity;
}

export interface ExternalFinding {
  claim: string;
  externalContext: string;
  contradiction: string;
  severity: Severity;
}

export interface AnalysisResult {
  companyName: string;
  credibilityScore: number; // 0-100, higher = more credible
  riskLevel: RiskLevel;
  verdict: string;
  summary: string;
  pillarScores: {
    linguistic: number; // 0-100
    quantitative: number;
    external: number;
  };
  toneAnalysis: {
    sentiment: string;
    incongruence: string;
  };
  linguisticFindings: LinguisticFinding[];
  quantitativeFindings: QuantitativeFinding[];
  externalFindings: ExternalFinding[];
  vagueClaims: string[];
  concreteCommitments: string[];
  recommendations: string[];
}

export interface ReportRow {
  id: string;
  company_name: string;
  source_type: string;
  status: string;
  credibility_score: number | null;
  risk_level: string | null;
  verdict: string | null;
  summary: string | null;
  raw_text: string | null;
  result: AnalysisResult | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export function riskColor(risk?: string | null): string {
  switch (risk) {
    case "low":
      return "text-credible";
    case "medium":
      return "text-warning";
    case "high":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function scoreLabel(score?: number | null): string {
  if (score == null) return "—";
  if (score >= 75) return "Credible";
  if (score >= 50) return "Mixed";
  if (score >= 25) return "Questionable";
  return "Suspicious";
}
