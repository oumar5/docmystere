import { config } from 'dotenv';
config();

import '@/ai/flows/clue-generation-assistant.ts';
import '@/ai/flows/solo-case-assistant.ts';
import '@/ai/prompts/evaluate-solo-case.ts';
import '@/ai/prompts/generate-solo-case.ts';
