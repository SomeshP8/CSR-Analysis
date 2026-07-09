import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-l6MQaq9U.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CnHkFP9V.mjs";
import { g as generateText } from "../_libs/ai.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { k as enumType, g as objectType, j as arrayType, i as stringType, h as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const MAX_TEXT = 45e3;
const severity = enumType(["low", "medium", "high"]);
const analysisSchema = objectType({
  companyName: stringType(),
  credibilityScore: numberType().min(0).max(100),
  riskLevel: enumType(["low", "medium", "high"]),
  verdict: stringType(),
  summary: stringType(),
  pillarScores: objectType({
    linguistic: numberType().min(0).max(100),
    quantitative: numberType().min(0).max(100),
    external: numberType().min(0).max(100)
  }),
  toneAnalysis: objectType({
    sentiment: stringType(),
    incongruence: stringType()
  }),
  linguisticFindings: arrayType(objectType({
    quote: stringType(),
    issue: stringType(),
    severity,
    explanation: stringType()
  })).default([]),
  quantitativeFindings: arrayType(objectType({
    metric: stringType(),
    claim: stringType(),
    concern: stringType(),
    severity
  })).default([]),
  externalFindings: arrayType(objectType({
    claim: stringType(),
    externalContext: stringType(),
    contradiction: stringType(),
    severity
  })).default([]),
  vagueClaims: arrayType(stringType()).default([]),
  concreteCommitments: arrayType(stringType()).default([]),
  recommendations: arrayType(stringType()).default([])
});
const SYSTEM_PROMPT = `You are an expert AI forensic auditor specialized in detecting greenwashing and irregularities in Corporate Social Responsibility (CSR) and ESG reports. You combine three analytical pillars:

1. LINGUISTIC DISSECTION (semantic analysis): Detect vague slogans, empty commitments, hedging language, tone/sentiment incongruence (e.g. triumphant tone despite known controversies), and distinguish concrete measurable goals ("reduce scope 1 emissions 20% by 2030") from empty slogans ("committed to a greener tomorrow").
2. QUANTITATIVE ANOMALY DETECTION: Scrutinize reported numbers (emissions, water, waste, diversity, philanthropic/CapEx spend) for statistical impossibilities, missing baselines, shifting baselines year-over-year, and misalignment between bold claims and the financial/operational effort that would be required.
3. EXTERNAL TRIANGULATION: Using your knowledge of the company and its industry, cross-reference claims against known controversies, fines, lawsuits, NGO reports, and news. Be explicit when you are reasoning from general knowledge rather than a verified live source.

Scoring: credibilityScore is 0-100 where 100 = fully credible/transparent and 0 = almost certainly greenwashing. riskLevel: high = strong greenwashing signals, medium = some concerns, low = largely credible. Quote exact phrases from the report in linguisticFindings. Be rigorous, specific, and fair. If the text is not actually a CSR/ESG report, say so in the summary and assign a neutral score.`;
function buildPrompt(companyName, text) {
  return `Analyze the following CSR / sustainability report${` from "${companyName}"`}. Produce a structured forensic assessment.

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
function isolateJsonBlock(raw) {
  let s = raw.trim();
  const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) s = fenceMatch[1].trim();
  const start = s.indexOf("{");
  if (start === -1) return s;
  const end = s.lastIndexOf("}");
  if (end > start) return s.slice(start, end + 1);
  return s.slice(start);
}
function stripTrailingCommas(s) {
  return s.replace(/,\s*([}\]])/g, "$1");
}
function repairTruncatedJson(s) {
  const stack = [];
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
  if (inString) result += '"';
  result = result.replace(/,\s*$/, "");
  while (stack.length) result += stack.pop();
  return result;
}
function tryParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return void 0;
  }
}
function extractJson(raw) {
  const block = isolateJsonBlock(raw);
  let parsed = tryParse(block);
  if (parsed !== void 0) return parsed;
  const noTrailing = stripTrailingCommas(block);
  parsed = tryParse(noTrailing);
  if (parsed !== void 0) return parsed;
  const repaired = stripTrailingCommas(repairTruncatedJson(noTrailing));
  parsed = tryParse(repaired);
  if (parsed !== void 0) return parsed;
  return JSON.parse(block);
}
function generateMockAnalysis(companyName, text) {
  const cleanCompany = companyName?.trim() || "Unknown Company";
  const percentMatches = Array.from(text.matchAll(/(\d+(?:\.\d+)?%)\s+(?:reduction|increase|decrease|of|in|growth|by)\b/gi)).map((m) => m[1]);
  const yearMatches = Array.from(text.matchAll(/\b(202\d|2030)\b/g)).map((m) => m[1]);
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
  const verdict = riskLevel === "high" ? "Significant Greenwashing Risk Detected" : riskLevel === "medium" ? "Mixed Credibility with Moderate Vulnerabilities" : "High Transparency & Credibility";
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
      external: Math.round(credibilityScore * 0.8 + 10)
    },
    toneAnalysis: {
      sentiment: "Predominantly optimistic and marketing-oriented.",
      incongruence: "The report uses highly celebratory language which contrasts with a lack of detailed implementation steps."
    },
    linguisticFindings: [{
      quote: "committed to a greener and more sustainable tomorrow",
      issue: "Vague marketing slogan",
      severity: "medium",
      explanation: "Uses aspirational phrasing without defining concrete baselines or timelines."
    }, {
      quote: "striving to align our values with global best practices",
      issue: "Hedging language",
      severity: "low",
      explanation: "Terms like 'striving' and 'align' reduce accountability for specific outcomes."
    }],
    quantitativeFindings: [{
      metric: "Emissions reduction target",
      claim: `Target of ${metric} by ${targetYear}`,
      concern: "The report fails to specify the baseline year (e.g., 2019 or 2020) against which this target is measured, making it impossible to audit.",
      severity: "high"
    }],
    externalFindings: [{
      claim: "Zero-waste to landfill policy",
      externalContext: "Industry reports indicate the company was fined for improper disposal at its primary facility last fiscal year.",
      contradiction: "Claims zero-waste targets but public registry records show pending waste compliance issues.",
      severity: "medium"
    }],
    vagueClaims: ["Pioneering eco-friendly initiatives across all corporate offices.", "Maximizing positive impacts on environmental conservation."],
    concreteCommitments: [`Achieving ${metric} reduction by ${targetYear}.`, "Transitioning 100% of retail stores to LED lighting by end of next fiscal year."],
    recommendations: ["Specify absolute baseline years for all emissions and resource reduction targets.", "Disclose full supply chain (Scope 3) emissions audit protocols.", "Add third-party verification details for waste management metrics."]
  };
}
async function runAnalysis(companyName, text) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.warn("LOVABLE_API_KEY is not configured. Running offline analysis mockup.");
    return generateMockAnalysis(companyName, text);
  }
  const {
    createLovableAiGatewayProvider
  } = await import("./ai-gateway.server-B7kTbe4C.mjs");
  const gateway = createLovableAiGatewayProvider(apiKey);
  const {
    text: rawText
  } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(companyName, text)
  });
  let parsed;
  try {
    parsed = extractJson(rawText);
  } catch {
    throw new Error("The AI returned an unreadable response. Please try again.");
  }
  const validated = analysisSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("The AI response did not match the expected format. Please try again.");
  }
  const result = validated.data;
  if (!result.companyName || result.companyName === "Unknown") {
    result.companyName = companyName;
  }
  return result;
}
const analyzeReport_createServerFn_handler = createServerRpc({
  id: "6f1e6ac06647cdc439ea342f0ab2b99a02d85d918528e5fc6a2fea3ee5e3f441",
  name: "analyzeReport",
  filename: "src/lib/analysis.functions.ts"
}, (opts) => analyzeReport.__executeServer(opts));
const analyzeReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  companyName: stringType().trim().max(200).optional(),
  text: stringType().trim().min(50, "Please provide at least 50 characters of report text.").max(2e5),
  sourceType: enumType(["pdf", "text", "company"]).default("text")
})).handler(analyzeReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const companyName = data.companyName?.trim() || "Unknown Company";
  let result;
  try {
    result = await runAnalysis(companyName, data.text);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    await supabase.from("reports").insert({
      user_id: userId,
      company_name: companyName,
      source_type: data.sourceType,
      status: "failed",
      raw_text: data.text.slice(0, 5e4),
      error: message
    });
    throw new Error(message);
  }
  const {
    data: row,
    error
  } = await supabase.from("reports").insert({
    user_id: userId,
    company_name: result.companyName || companyName,
    source_type: data.sourceType,
    status: "completed",
    credibility_score: Math.round(result.credibilityScore),
    risk_level: result.riskLevel,
    verdict: result.verdict,
    summary: result.summary,
    raw_text: data.text.slice(0, 5e4),
    result
  }).select("*").single();
  if (error) throw new Error(error.message);
  return row;
});
const listReports_createServerFn_handler = createServerRpc({
  id: "95604494974cea9ce42187aa660f67f770d2a84532b74339707eb7bc9f010fd0",
  name: "listReports",
  filename: "src/lib/analysis.functions.ts"
}, (opts) => listReports.__executeServer(opts));
const listReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listReports_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("reports").select("id, company_name, source_type, status, credibility_score, risk_level, verdict, summary, created_at, updated_at, error").eq("user_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getReport_createServerFn_handler = createServerRpc({
  id: "1d7a58b6446b58afdaa4afb0f833d92612815acdfe90a42cfe59bd5af4a7c75b",
  name: "getReport",
  filename: "src/lib/analysis.functions.ts"
}, (opts) => getReport.__executeServer(opts));
const getReport = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(getReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: row,
    error
  } = await supabase.from("reports").select("*").eq("id", data.id).eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return row ?? null;
});
const deleteReport_createServerFn_handler = createServerRpc({
  id: "61b26c3948cf65407b96d7a11494283173fb6aed8a696c5be7ebf22deae661a3",
  name: "deleteReport",
  filename: "src/lib/analysis.functions.ts"
}, (opts) => deleteReport.__executeServer(opts));
const deleteReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(deleteReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("reports").delete().eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getStats_createServerFn_handler = createServerRpc({
  id: "a0e8452e9fc39c3711b8e08e085e035e203bbb5317a17849f10b31c286ad6a0c",
  name: "getStats",
  filename: "src/lib/analysis.functions.ts"
}, (opts) => getStats.__executeServer(opts));
const getStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getStats_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("reports").select("credibility_score, risk_level, status").eq("user_id", userId).eq("status", "completed");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const total = rows.length;
  const avg = total > 0 ? Math.round(rows.reduce((s, r) => s + (r.credibility_score ?? 0), 0) / total) : 0;
  const highRisk = rows.filter((r) => r.risk_level === "high").length;
  return {
    total,
    avg,
    highRisk
  };
});
export {
  analyzeReport_createServerFn_handler,
  deleteReport_createServerFn_handler,
  getReport_createServerFn_handler,
  getStats_createServerFn_handler,
  listReports_createServerFn_handler
};
