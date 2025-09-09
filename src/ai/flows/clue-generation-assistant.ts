'use server';

/**
 * @fileOverview An AI assistant for generating clue suggestions for the Doc Mystère game.
 *
 * This file exports:
 * - `generateClueSuggestions`: An asynchronous function that takes game state and player role as input and returns clue suggestions.
 * - `ClueGenerationInput`: The input type for the `generateClueSuggestions` function.
 * - `ClueSuggestionOutput`: The output type for the `generateClueSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {
  ClueGenerationInputSchema,
  ClueSuggestionOutputSchema,
  type ClueGenerationInput,
  type ClueSuggestionOutput,
} from '@/ai/schemas/clue-generation';
import {clueGenerationPrompt} from '@/ai/prompts/generate-clue-suggestions';

export async function generateClueSuggestions(
  input: ClueGenerationInput
): Promise<ClueSuggestionOutput> {
  return clueGenerationAssistantFlow(input);
}

const clueGenerationAssistantFlow = ai.defineFlow(
  {
    name: 'clueGenerationAssistantFlow',
    inputSchema: ClueGenerationInputSchema,
    outputSchema: ClueSuggestionOutputSchema,
  },
  async input => {
    const {output} = await clueGenerationPrompt(input);
    return output!;
  }
);
