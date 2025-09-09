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
import {z} from 'genkit';

const ClueGenerationInputSchema = z.object({
  role: z
    .enum(['Doctor', 'MisguidedDoctor', 'MysteryDoc'])
    .describe('The role of the player.'),
  word: z.string().optional().describe('The secret word assigned to the player.'),
  otherClues: z
    .array(z.string())
    .describe('Clues given by other players in the current round.'),
  specialty: z.string().describe('The medical specialty of the game.'),
});
export type ClueGenerationInput = z.infer<typeof ClueGenerationInputSchema>;

const ClueSuggestionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of clue suggestions based on the player role and game state.'),
});
export type ClueSuggestionOutput = z.infer<typeof ClueSuggestionOutputSchema>;

export async function generateClueSuggestions(
  input: ClueGenerationInput
): Promise<ClueSuggestionOutput> {
  return clueGenerationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clueGenerationPrompt',
  input: {schema: ClueGenerationInputSchema},
  output: {schema: ClueSuggestionOutputSchema},
  prompt: `You are an AI assistant designed to help players in the Doc Mystère game come up with clue suggestions.

You will receive the player's role, their secret word (if applicable), clues given by other players, and the medical specialty of the game.

Based on this information, you will provide 3 clue suggestions that are relevant to the player's role and the current game state.

Role: {{{role}}}
Word: {{{word}}}
Other Clues: {{#each otherClues}}{{{this}}}, {{/each}}
Specialty: {{{specialty}}}

Suggestions:
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const clueGenerationAssistantFlow = ai.defineFlow(
  {
    name: 'clueGenerationAssistantFlow',
    inputSchema: ClueGenerationInputSchema,
    outputSchema: ClueSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
