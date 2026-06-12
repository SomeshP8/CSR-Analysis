import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Creates an AI SDK provider wired to the Lovable AI Gateway.
 * Server-only: relies on LOVABLE_API_KEY which must never reach the browser.
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
    },
  });
}
