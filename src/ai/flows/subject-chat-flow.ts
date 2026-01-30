
'use server';
/**
 * @fileOverview An academic tutor chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const SubjectChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history, including the latest user message.'),
});
export type SubjectChatInput = z.infer<typeof SubjectChatInputSchema>;


// The output is just the model's text response. The state management (subject) will happen client-side based on the response.
const SubjectChatOutputSchema = z.string();
export type SubjectChatOutput = z.infer<typeof SubjectChatOutputSchema>;


export async function subjectChat(input: SubjectChatInput): Promise<SubjectChatOutput> {
  return subjectChatFlow(input);
}

const subjectChatFlow = ai.defineFlow(
  {
    name: 'subjectChatFlow',
    inputSchema: SubjectChatInputSchema,
    outputSchema: SubjectChatOutputSchema,
  },
  async ({ history }) => {

    const systemPrompt = `You are an AI Tutor Chatbot for a learning application. Your purpose is to assist students with their academic questions.

Your core directives are:
1.  **Stay Academic:** You must only answer questions related to academic subjects. This includes topics like math, science, literature, history, computer science, etc.
2.  **Decline Non-Academic Questions:** If a user asks a question that is not academic (e.g., about personal opinions, pop culture, or casual conversation), you must politely decline to answer. You can say something like, "My purpose is to help with academic subjects. I can't answer questions outside of that scope. Do you have a question about a school subject?"
3.  **Be a Helpful Tutor:** For academic questions, provide clear, student-friendly, and accurate explanations. Your tone should be encouraging and supportive.
4.  **Do Not Ask for a Subject:** You should not ask the user to specify a subject. Just answer the academic questions they ask.`;

    const genkitHistory = history.map((message) => ({
      role: message.role,
      content: [{ text: message.content }],
    }));

    // The Gemini API requires that the 'history' array starts with a 'user' message.
    // The client-side implementation might send a history starting with a 'model'
    // message (the bot's initial greeting). We find the first 'user'
    // message and start the history from there to ensure correctness.
    const firstUserMessageIndex = genkitHistory.findIndex(m => m.role === 'user');
    const validHistoryForGemini = firstUserMessageIndex !== -1
      ? genkitHistory.slice(firstUserMessageIndex)
      : [];


    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        history: validHistoryForGemini,
    });

    return response.text;
  }
);
