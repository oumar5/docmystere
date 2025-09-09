import {z} from 'genkit';

// Schema for generating a case
export const SoloCaseInputSchema = z.object({
  specialty: z.string().describe('The medical specialty for the clinical case, e.g., Cardiology.'),
});
export type SoloCaseInput = z.infer<typeof SoloCaseInputSchema>;

export const SoloCaseSchema = z.object({
  specialty: z.string().describe('The specialty of the case, as requested by the user.'),
  caseDescription: z.string().describe('A detailed description of the clinical case, including patient history, symptoms, and exam findings. Should be presented in French.'),
  diagnosis: z.string().describe('The correct diagnosis for the case. Should be in French.'),
});
export type SoloCase = z.infer<typeof SoloCaseSchema>;

// Schema for evaluating a case
export const SoloCaseEvaluationInputSchema = z.object({
    caseDescription: z.string().describe('The original clinical case description.'),
    correctDiagnosis: z.string().describe('The correct diagnosis for the case.'),
    userDiagnosis: z.string().describe("The diagnosis provided by the user."),
});
export type SoloCaseEvaluationInput = z.infer<typeof SoloCaseEvaluationInputSchema>;

export const SoloCaseEvaluationSchema = z.object({
    isCorrect: z.boolean().describe('Whether the user diagnosis is correct or close enough.'),
    feedback: z.string().describe('Detailed feedback for the user, explaining why their diagnosis is correct or incorrect. Provide educational points. Should be in French.'),
});
export type SoloCaseEvaluation = z.infer<typeof SoloCaseEvaluationSchema>;
