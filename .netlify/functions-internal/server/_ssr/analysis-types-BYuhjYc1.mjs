function scoreLabel(score) {
  if (score == null) return "—";
  if (score >= 75) return "Credible";
  if (score >= 50) return "Mixed";
  if (score >= 25) return "Questionable";
  return "Suspicious";
}
export {
  scoreLabel as s
};
