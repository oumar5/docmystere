'use server';

import {ai} from '@/ai/genkit';
import {
  ClueGenerationInputSchema,
  ClueSuggestionOutputSchema,
} from '@/ai/schemas/clue-generation';

export const clueGenerationPrompt = ai.definePrompt({
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
`,
  config: {
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
