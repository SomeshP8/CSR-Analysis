import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText } from "ai";

import type { AnalysisResult, ReportRow } from "./analysis-types";


const MAX_TEXT = 45000;

const severity = z.enum(["low", "medium", "high"]);

const analysisSchema = z.object({
  companyName: z.string(),
  credibilityScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high"]),
  verdict: z.string(),
  summary: z.string(),
  pillarScores: z.object({
    linguistic: z.number().min(0).max(100),
    quantitative: z.number().min(0).max(100),
    external: z.number().min(0).max(100),
  }),
  toneAnalysis: z.object({
    sentiment: z.string(),
    incongruence: z.string(),
  }),
  linguisticFindings: z
    .array(
      z.object({
        quote: z.string(),
        issue: z.string(),
        severity,
        explanation: z.string(),
      }),
    )
    .default([]),
  quantitativeFindings: z
    .array(
      z.object({
        metric: z.string(),
        claim: z.string(),
        concern: z.string(),
        severity,
      }),
    )
    .default([]),
  externalFindings: z
    .array(
      z.object({
        claim: z.string(),
        externalContext: z.string(),
        contradiction: z.string(),
        severity,
      }),
    )
    .default([]),
  vagueClaims: z.array(z.string()).default([]),
  concreteCommitments: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

const SYSTEM_PROMPT = `You are an expert AI forensic auditor specialized in detecting greenwashing and irregularities in Corporate Social Responsibility (CSR) and ESG reports. You combine three analytical pillars:

1. LINGUISTIC DISSECTION (semantic analysis): Detect vague slogans, empty commitments, hedging language, tone/sentiment incongruence (e.g. triumphant tone despite known controversies), and distinguish concrete measurable goals ("reduce scope 1 emissions 20% by 2030") from empty slogans ("committed to a greener tomorrow").
2. QUANTITATIVE ANOMALY DETECTION: Scrutinize reported numbers (emissions, water, waste, diversity, philanthropic/CapEx spend) for statistical impossibilities, missing baselines, shifting baselines year-over-year, and misalignment between bold claims and the financial/operational effort that would be required.
3. EXTERNAL TRIANGULATION: Using your knowledge of the company and its industry, cross-reference claims against known controversies, fines, lawsuits, NGO reports, and news. Be explicit when you are reasoning from general knowledge rather than a verified live source.

Scoring: credibilityScore is 0-100 where 100 = fully credible/transparent and 0 = almost certainly greenwashing. riskLevel: high = strong greenwashing signals, medium = some concerns, low = largely credible. Quote exact phrases from the report in linguisticFindings. Be rigorous, specific, and fair. If the text is not actually a CSR/ESG report, say so in the summary and assign a neutral score.`;

function buildPrompt(companyName: string, text: string): string {
  return `Analyze the following CSR / sustainability report${
    companyName ? ` from "${companyName}"` : ""
  }. Produce a structured forensic assessment.

Respond with ONLY a single valid JSON object (no markdown, no code fences, no commentary) matching exactly this shape:
{
  "companyName": string,
  "credibilityScore": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "verdict": string,
  "summary": string,
  "pillarScores": { "linguistic": number, "quantitative": number, "external": number },
  "toneAnalysis": { "sentiment": string, "incongruence": string },
  "linguisticFindings": [ { "quote": string, "issue": string, "severity": "low"|"medium"|"high", "explanation": string } ],
  "quantitativeFindings": [ { "metric": string, "claim": string, "concern": string, "severity": "low"|"medium"|"high" } ],
  "externalFindings": [ { "claim": string, "externalContext": string, "contradiction": string, "severity": "low"|"medium"|"high" } ],
  "vagueClaims": string[],
  "concreteCommitments": string[],
  "recommendations": string[]
}

--- BEGIN REPORT TEXT ---
${text.slice(0, MAX_TEXT)}
--- END REPORT TEXT ---`;
}

/** Strip code fences and any prose around the JSON object. */
function isolateJsonBlock(raw: string): string {
  let s = raw.trim();
  const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) s = fenceMatch[1].trim();
  const start = s.indexOf("{");
  if (start === -1) return s;
  const end = s.lastIndexOf("}");
  if (end > start) return s.slice(start, end + 1);
  // No closing brace — likely truncated; take from first "{" onward.
  return s.slice(start);
}

/** Remove trailing commas before } or ] which are invalid JSON. */
function stripTrailingCommas(s: string): string {
  return s.replace(/,\s*([}\]])/g, "$1");
}

/**
 * Repair a truncated JSON object by closing any open strings, arrays,
 * and objects, walking the structure while respecting string escapes.
 */
function repairTruncatedJson(s: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let result = s;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      stack.push("}");
    } else if (ch === "[") {
      stack.push("]");
    } else if (ch === "}" || ch === "]") {
      stack.pop();
    }
  }

  // Close an unterminated string.
  if (inString) result += '"';
  // Remove a dangling trailing comma left after truncation.
  result = result.replace(/,\s*$/, "");
  // Close any still-open containers (innermost first).
  while (stack.length) result += stack.pop();
  return result;
}

function tryParse(s: string): unknown | undefined {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

function extractJson(raw: string): unknown {
  const block = isolateJsonBlock(raw);

  // 1. Direct parse.
  let parsed = tryParse(block);
  if (parsed !== undefined) return parsed;

  // 2. Strip trailing commas.
  const noTrailing = stripTrailingCommas(block);
  parsed = tryParse(noTrailing);
  if (parsed !== undefined) return parsed;

  // 3. Repair truncation, then strip trailing commas again.
  const repaired = stripTrailingCommas(repairTruncatedJson(noTrailing));
  parsed = tryParse(repaired);
  if (parsed !== undefined) return parsed;

  // Throw the original error for the caller to handle.
  return JSON.parse(block);
}

function generateMockAnalysis(companyName: string, text: string): AnalysisResult {
  const cleanCompany = companyName?.trim() || "Unknown Company";
  
  const percentMatches = Array.from(text.matchAll(/(\d+(?:\.\d+)?%)\s+(?:reduction|increase|decrease|of|in|growth|by)\b/gi)).map(m => m[1]);
  const yearMatches = Array.from(text.matchAll(/\b(202\d|2030)\b/g)).map(m => m[1]);
  
  const metric = percentMatches[0] || "25% Carbon reduction";
  const targetYear = yearMatches[0] || "2030";

  let credibilityScore = 65;
  if (text.toLowerCase().includes("committed to") || text.toLowerCase().includes("our mission")) {
    credibilityScore -= 10;
  }
  if (percentMatches.length > 3) {
    credibilityScore += 15;
  }
  credibilityScore = Math.max(15, Math.min(95, credibilityScore));

  const riskLevel = credibilityScore >= 75 ? "low" : credibilityScore >= 45 ? "medium" : "high";

  const verdict = riskLevel === "high"
    ? "Significant Greenwashing Risk Detected"
    : riskLevel === "medium"
      ? "Mixed Credibility with Moderate Vulnerabilities"
      : "High Transparency & Credibility";

  const summary = `Offline/Demo Analysis for ${cleanCompany}. The document contains references to sustainability goals for ${targetYear}. The AI system has flagged certain marketing slogans and empty commitments, while noting concrete plans around ${metric}. Because the LOVABLE_API_KEY environment variable is not configured, this analysis was generated locally.`;

  return {
    companyName: cleanCompany,
    credibilityScore,
    riskLevel,
    verdict,
    summary,
    pillarScores: {
      linguistic: Math.round(credibilityScore * 0.9 + 5),
      quantitative: Math.round(credibilityScore * 1.1 - 5),
      external: Math.round(credibilityScore * 0.8 + 10),
    },
    toneAnalysis: {
      sentiment: "Predominantly optimistic and marketing-oriented.",
      incongruence: "The report uses highly celebratory language which contrasts with a lack of detailed implementation steps.",
    },
    linguisticFindings: [
      {
        quote: "committed to a greener and more sustainable tomorrow",
        issue: "Vague marketing slogan",
        severity: "medium",
        explanation: "Uses aspirational phrasing without defining concrete baselines or timelines.",
      },
      {
        quote: "striving to align our values with global best practices",
        issue: "Hedging language",
        severity: "low",
        explanation: "Terms like 'striving' and 'align' reduce accountability for specific outcomes.",
      }
    ],
    quantitativeFindings: [
      {
        metric: "Emissions reduction target",
        claim: `Target of ${metric} by ${targetYear}`,
        concern: "The report fails to specify the baseline year (e.g., 2019 or 2020) against which this target is measured, making it impossible to audit.",
        severity: "high",
      }
    ],
    externalFindings: [
      {
        claim: "Zero-waste to landfill policy",
        externalContext: "Industry reports indicate the company was fined for improper disposal at its primary facility last fiscal year.",
        contradiction: "Claims zero-waste targets but public registry records show pending waste compliance issues.",
        severity: "medium",
      }
    ],
    vagueClaims: [
      "Pioneering eco-friendly initiatives across all corporate offices.",
      "Maximizing positive impacts on environmental conservation."
    ],
    concreteCommitments: [
      `Achieving ${metric} reduction by ${targetYear}.`,
      "Transitioning 100% of retail stores to LED lighting by end of next fiscal year."
    ],
    recommendations: [
      "Specify absolute baseline years for all emissions and resource reduction targets.",
      "Disclose full supply chain (Scope 3) emissions audit protocols.",
      "Add third-party verification details for waste management metrics."
    ]
  };
}

async function runAnalysis(companyName: string, text: string): Promise<AnalysisResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.warn("LOVABLE_API_KEY is not configured. Running offline analysis mockup.");
    return generateMockAnalysis(companyName, text);
  }

  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(apiKey);

  const { text: rawText } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(companyName, text),
  });

  let parsed: unknown;
  try {
    parsed = extractJson(rawText);
  } catch {
    throw new Error("The AI returned an unreadable response. Please try again.");
  }

  const validated = analysisSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("The AI response did not match the expected format. Please try again.");
  }

  const result = validated.data as AnalysisResult;
  if (companyName && (!result.companyName || result.companyName === "Unknown")) {
    result.companyName = companyName;
  }
  return result;
}


export const analyzeReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      companyName: z.string().trim().max(200).optional(),
      text: z.string().trim().min(50, "Please provide at least 50 characters of report text.").max(200000),
      sourceType: z.enum(["pdf", "text", "company"]).default("text"),
    }),
  )
  .handler(async ({ data, context }): Promise<ReportRow> => {
    const { supabase, userId } = context;
    const companyName = data.companyName?.trim() || "Unknown Company";

    let result: AnalysisResult;
    try {
      result = await runAnalysis(companyName, data.text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      await supabase.from("reports").insert({
        user_id: userId,
        company_name: companyName,
        source_type: data.sourceType,
        status: "failed",
        raw_text: data.text.slice(0, 50000),
        error: message,
      });
      throw new Error(message);
    }


    const { data: row, error } = await supabase
      .from("reports")
      .insert({
        user_id: userId,
        company_name: result.companyName || companyName,
        source_type: data.sourceType,
        status: "completed",
        credibility_score: Math.round(result.credibilityScore),
        risk_level: result.riskLevel,
        verdict: result.verdict,
        summary: result.summary,
        raw_text: data.text.slice(0, 50000),
        result: result as never,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return row as unknown as ReportRow;
  });

export const listReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ReportRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("reports")
      .select("id, company_name, source_type, status, credibility_score, risk_level, verdict, summary, created_at, updated_at, error")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ReportRow[];
  });

export const getReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }): Promise<ReportRow | null> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as unknown as ReportRow) ?? null;
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("reports")
      .select("credibility_score, risk_level, status")
      .eq("user_id", userId)
      .eq("status", "completed");
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const total = rows.length;
    const avg =
      total > 0
        ? Math.round(rows.reduce((s, r) => s + (r.credibility_score ?? 0), 0) / total)
        : 0;
    const highRisk = rows.filter((r) => r.risk_level === "high").length;
    return { total, avg, highRisk };
  });
