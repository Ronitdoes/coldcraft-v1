/**
 * AI Generation Functions
 *
 * Public API consumed by route handlers.
 * Each function defines the provider fallback order for its use-case.
 */

import type { AIGenerationResponse } from "./types";
import {
  geminiProvider,
  groqMailProvider,
  groqParseProvider,
  runWithFallback,
} from "./providers";

// ---------------------------------------------------------------------------
// Mail Generation
// ---------------------------------------------------------------------------

interface GenerateMailOptions {
  systemPrompt: string;
  userMessage: string;
  temperature: number;
}

/**
 * Generate a cold email using the AI provider chain.
 *
 * Priority: Gemini → Groq (llama-3.3-70b-versatile)
 */
export async function generateMailWithAI(
  opts: GenerateMailOptions,
): Promise<AIGenerationResponse> {
  return runWithFallback(
    [geminiProvider, groqMailProvider],
    {
      systemPrompt: opts.systemPrompt,
      userMessage: opts.userMessage,
      temperature: opts.temperature,
      maxTokens: 600,
    },
  );
}

// ---------------------------------------------------------------------------
// Resume Parsing
// ---------------------------------------------------------------------------

interface ParseResumeOptions {
  systemPrompt: string;
  userMessage: string;
}

/**
 * Parse a resume using the AI provider chain.
 *
 * Priority: Groq (llama-3.1-8b-instant) → Gemini
 */
export async function parseResumeWithAI(
  opts: ParseResumeOptions,
): Promise<AIGenerationResponse> {
  return runWithFallback(
    [groqParseProvider, geminiProvider],
    {
      systemPrompt: opts.systemPrompt,
      userMessage: opts.userMessage,
      temperature: 0.1,
      maxTokens: 700,
    },
  );
}
