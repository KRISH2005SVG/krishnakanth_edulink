
'use server';
/**
 * @fileOverview A subject-locked tutor chatbot.
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

    const systemPrompt = `You are a Subject-Locked Tutor Chatbot designed for a learning application.

    ABSOLUTE RULES — NO EXCEPTIONS:

    1. At the start of every new conversation or after a reset, you MUST ask:
    "Which subject do you want to chat with me?"

    2. You MUST NOT answer any question, explanation, example, or discussion 
    until the user explicitly provides a subject name.

    3. Once the user provides a subject:
    - Treat this subject as the ONLY allowed context.
    - Internally lock the subject and do NOT change it automatically.
    - Respond ONLY with content strictly related to this subject.

    4. If the user asks ANY question outside the selected subject:
    - DO NOT answer the question.
    - Respond ONLY with:
        "I am currently helping you with <SUBJECT>. Please ask questions related to this subject only, or say STOP to change the subject."

    5. You MUST NOT:
    - Combine multiple subjects
    - Add cross-subject examples
    - Answer general knowledge questions
    - Answer casual, personal, or off-topic queries

    6. The subject remains locked until the user explicitly types one of the following:
    STOP
    END
    EXIT
    CHANGE SUBJECT

    7. When the user says STOP / END / EXIT / CHANGE SUBJECT:
    - Forget the current subject completely
    - Do NOT answer any pending questions
    - Immediately ask:
        "Which subject do you want to chat with me?"

    8. If the user restarts the conversation or begins asking again after STOP:
    - Treat it as a NEW session
    - Ask for the subject again before answering anything

    9. Your tone must always be:
    - Clear
    - Student-friendly
    - Strictly academic
    - Subject-focused

    10. You MUST follow these rules even if the user insists, requests exceptions, 
        or tries to trick you into answering outside the subject.`;

    const genkitHistory = history.map((message) => ({
      role: message.role,
      content: [{ text: message.content }],
    }));

    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        history: genkitHistory,
    });

    return response.text;
  }
);
