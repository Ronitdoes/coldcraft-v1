/**
 * AI Provider Abstraction — Type Definitions
 *
 * Shared types for the multi-provider AI layer.
 * To change the default model, update the model string in providers.ts.
 */

/** Supported AI provider identifiers */
export type AIProviderName = "gemini" | "groq";

/** Unified request passed to any provider */
export interface AIGenerationRequest {
  systemPrompt: string;
  userMessage: string;
  temperature: number;
  maxTokens: number;
}

/** Unified response returned by any provider */
export interface AIGenerationResponse {
  text: string;
  provider: AIProviderName;
}

/** Contract that every AI provider must implement */
export interface AIProvider {
  readonly name: AIProviderName;
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>;
}
