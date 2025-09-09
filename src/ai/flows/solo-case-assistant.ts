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
import {z} from 'genkit';

// Schema for generating a case
const SoloCaseInputSchema = z.object({
  specialty: z.string().describe('The medical specialty for the clinical case, e.g., Cardiology.'),
});
export type SoloCaseInput = z.infer<typeof SoloCaseInputSchema>;

const SoloCaseSchema = z.object({
  specialty: z.string().describe('The specialty of the case.'),
  caseDescription: z.string().describe('A detailed description of the clinical case, including patient history, symptoms, and exam findings. Should be presented in French.'),
  diagnosis: z.string().describe('The correct diagnosis for the case. Should be in French.'),
});
export type SoloCase = z.infer<typeof SoloCaseSchema>;

// Schema for evaluating a case
const SoloCaseEvaluationInputSchema = z.object({
    caseDescription: z.string().describe('The original clinical case description.'),
    correctDiagnosis: z.string().describe('The correct diagnosis for the case.'),
    userDiagnosis: z.string().describe("The diagnosis provided by the user."),
});
export type SoloCaseEvaluationInput = z.infer<typeof SoloCaseEvaluationInputSchema>;

const SoloCaseEvaluationSchema = z.object({
    isCorrect: z.boolean().describe('Whether the user diagnosis is correct or close enough.'),
    feedback: z.string().describe('Detailed feedback for the user, explaining why their diagnosis is correct or incorrect. Provide educational points. Should be in French.'),
});
export type SoloCaseEvaluation = z.infer<typeof SoloCaseEvaluationSchema>;


// Flow to generate a case
const generateCasePrompt = ai.definePrompt({
  name: 'generateSoloCasePrompt',
  input: {schema: SoloCaseInputSchema},
  output: {schema: SoloCaseSchema},
  prompt: `You are a medical professor creating a challenging clinical case for a medical student.
Generate a case based on the following specialty: {{{specialty}}}.

The case description should be detailed enough for a diagnosis to be made, but not overly obvious.
Provide the correct diagnosis separately.
The entire output must be in French.
`,
});

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


// Flow to evaluate a diagnosis
const evaluateCasePrompt = ai.definePrompt({
    name: 'evaluateSoloCasePrompt',
    input: {schema: SoloCaseEvaluationInputSchema},
    output: {schema: SoloCaseEvaluationSchema},
    prompt: `You are a medical professor evaluating a student's diagnosis.

    Case: {{{caseDescription}}}
    Correct Diagnosis: {{{correctDiagnosis}}}
    Student's Diagnosis: {{{userDiagnosis}}}
    
    Evaluate if the student's diagnosis is correct. It can be considered correct if it is a synonym or a very close clinical equivalent.
    Provide constructive feedback. If the student is wrong, explain the reasoning and guide them towards the correct diagnosis. If they are correct, congratulate them and provide additional interesting facts about the condition.
    The entire output must be in French.
    `,
});

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
