import { z } from "zod";

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
  linguisticFindings: z.array(z.any()).default([]),
  quantitativeFindings: z.array(z.any()).default([]),
  externalFindings: z.array(z.any()).default([]),
  vagueClaims: z.array(z.string()).default([]),
  concreteCommitments: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

function generateMockAnalysis(companyName, text) {
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
  const verdict = riskLevel === "high" ? "High risk" : riskLevel === "medium" ? "Medium risk" : "Low risk";
  const summary = "Summary here";

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
    linguisticFindings: [],
    quantitativeFindings: [],
    externalFindings: [],
    vagueClaims: [],
    concreteCommitments: [],
    recommendations: []
  };
}

const res = generateMockAnalysis("Test", "This is a very long string that is at least 50 characters long so we can test it.");
console.log(analysisSchema.safeParse(res));
