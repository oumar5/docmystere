'use server';

/**
 * @fileOverview AI assistant for the solo diagnosis game mode.
 *
 * This file exports:
 * - `generateSoloCase`: Generates a new clinical case for the player.
 * - `evaluateSoloCase`: Evaluates the player's diagnosis against the correct one.
 * - `SoloCaseInput`, `SoloCase`, `SoloCaseEvaluationInput`, `SoloCaseEvaluation`
 */

import {ai} from '@/ai/genkit';
import {
  SoloCaseInputSchema,
  SoloCaseSchema,
  SoloCaseEvaluationInputSchema,
  SoloCaseEvaluationSchema,
  type SoloCaseInput,
  type SoloCase,
  type SoloCaseEvaluationInput,
  type SoloCaseEvaluation,
} from '@/ai/schemas/solo-case';
import {generateCasePrompt} from '@/ai/prompts/generate-solo-case';
import {evaluateCasePrompt} from '@/ai/prompts/evaluate-solo-case';

const generateSoloCaseFlow = ai.defineFlow(
  {
    name: 'generateSoloCaseFlow',
    inputSchema: SoloCaseInputSchema,
    outputSchema: SoloCaseSchema,
  },
  async input => {
    const {output} = await generateCasePrompt(input);
    return output!;
  }
);

export async function generateSoloCase(input: SoloCaseInput): Promise<SoloCase> {
    return generateSoloCaseFlow(input);
}

const evaluateSoloCaseFlow = ai.defineFlow(
    {
        name: 'evaluateSoloCaseFlow',
        inputSchema: SoloCaseEvaluationInputSchema,
        outputSchema: SoloCaseEvaluationSchema,
    },
    async input => {
        const {output} = await evaluateCasePrompt(input);
        return output!;
    }
);

export async function evaluateSoloCase(input: SoloCaseEvaluationInput): Promise<SoloCaseEvaluation> {
    return evaluateSoloCaseFlow(input);
}
