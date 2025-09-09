import {z} from 'genkit';

export const ClueGenerationInputSchema = z.object({
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

export const ClueSuggestionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of clue suggestions based on the player role and game state.'),
});
export type ClueSuggestionOutput = z.infer<typeof ClueSuggestionOutputSchema>;
