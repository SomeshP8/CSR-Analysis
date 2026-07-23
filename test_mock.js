import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
    linguisticFindings: [],
    quantitativeFindings: [],
    externalFindings: [],
    vagueClaims: [],
    concreteCommitments: [],
    recommendations: []
  };
}

const res = generateMockAnalysis("Test", "This is a very long string that is at least 50 characters long so we can test it.");
console.log(res);
