'use server';
/**
 * @fileOverview A smart tutor matching AI agent.
 *
 * - smartTutorMatching - A function that handles the tutor matching process.
 * - SmartTutorMatchingInput - The input type for the smartTutorMatching function.
 * - SmartTutorMatchingOutput - The return type for the smartTutorMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTutorMatchingInputSchema = z.object({
  learningGoals: z
    .string()
    .describe('The learning goals of the student.'),
  academicNeeds: z.string().describe('The academic needs of the student.'),
  subjects: z.array(z.string()).describe('The subjects the student needs help with.'),
});
export type SmartTutorMatchingInput = z.infer<typeof SmartTutorMatchingInputSchema>;

const SmartTutorMatchingOutputSchema = z.object({
  tutorSuggestions: z
    .array(
      z.object({
        name: z.string().describe('The name of the tutor.'),
        subject: z.string().describe('The subject the tutor specializes in.'),
        experience: z.string().describe('The experience of the tutor.'),
        rating: z.number().describe('The rating of the tutor.'),
        availability: z.string().describe('The availability of the tutor.'),
      })
    )
    .describe('The list of tutor suggestions.'),
});
export type SmartTutorMatchingOutput = z.infer<typeof SmartTutorMatchingOutputSchema>;

export async function smartTutorMatching(input: SmartTutorMatchingInput): Promise<SmartTutorMatchingOutput> {
  return smartTutorMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTutorMatchingPrompt',
  input: {schema: SmartTutorMatchingInputSchema},
  output: {schema: SmartTutorMatchingOutputSchema},
  prompt: `You are an AI assistant designed to match students with the best tutors for their needs.

  Given the student's learning goals, academic needs, and preferred subjects, suggest a list of tutors that would be a good fit.

  Learning Goals: {{{learningGoals}}}
  Academic Needs: {{{academicNeeds}}}
  Subjects: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  
  Format your response as a JSON array of tutor objects.
  Each tutor object should have the following fields:
  - name: The name of the tutor
  - subject: The subject the tutor specializes in
  - experience: The experience of the tutor
  - rating: The rating of the tutor
  - availability: The availability of the tutor
  `,
});

const smartTutorMatchingFlow = ai.defineFlow(
  {
    name: 'smartTutorMatchingFlow',
    inputSchema: SmartTutorMatchingInputSchema,
    outputSchema: SmartTutorMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
