import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText, Output } from "ai";

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

--- BEGIN REPORT TEXT ---
${text.slice(0, MAX_TEXT)}
--- END REPORT TEXT ---`;
}

async function runAnalysis(companyName: string, text: string): Promise<AnalysisResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI service is not configured.");

  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(apiKey);

  const { experimental_output } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(companyName, text),
    experimental_output: Output.object({ schema: analysisSchema }),
  });

  const result = experimental_output as AnalysisResult;
  if (companyName && (!result.companyName || result.companyName === "Unknown")) {
    result.companyName = companyName;
  }
  return result;
}

export const analyzeReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
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
      const { data: row } = await supabase
        .from("reports")
        .insert({
          user_id: userId,
          company_name: companyName,
          source_type: data.sourceType,
          status: "failed",
          raw_text: data.text.slice(0, 50000),
          error: message,
        })
        .select("*")
        .single();
      throw new Error(message + (row ? "" : ""));
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
        result: result as unknown as Record<string, unknown>,
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
  .inputValidator(z.object({ id: z.string().uuid() }))
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
  .inputValidator(z.object({ id: z.string().uuid() }))
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
