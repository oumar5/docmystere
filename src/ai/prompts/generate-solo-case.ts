'use server';

import {ai} from '@/ai/genkit';
import {
  SoloCaseInputSchema,
  SoloCaseSchema,
} from '@/ai/schemas/solo-case';

export const generateCasePrompt = ai.definePrompt({
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
