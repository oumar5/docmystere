'use server';

import {ai} from '@/ai/genkit';
import {
  SoloCaseEvaluationInputSchema,
  SoloCaseEvaluationSchema,
} from '@/ai/schemas/solo-case';

export const evaluateCasePrompt = ai.definePrompt({
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
