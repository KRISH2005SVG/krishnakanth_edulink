
"use server";

import { subjectChat } from "@/ai/flows/subject-chat-flow";
import type { SubjectChatInput, SubjectChatOutput } from "@/ai/flows/subject-chat-flow";

export async function getChatbotResponse(
  input: SubjectChatInput
): Promise<SubjectChatOutput> {
  try {
    const result = await subjectChat(input);
    return result;
  } catch (error) {
    console.error("Error in subjectChat flow:", error);
    throw new Error("Failed to get chatbot response from AI.");
  }
}
