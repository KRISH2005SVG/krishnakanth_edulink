"use server";

import { smartTutorMatching } from "@/ai/flows/smart-tutor-matching";
import type { SmartTutorMatchingInput, SmartTutorMatchingOutput } from "@/ai/flows/smart-tutor-matching";

export async function getTutorSuggestions(
  input: SmartTutorMatchingInput
): Promise<SmartTutorMatchingOutput> {
  try {
    const result = await smartTutorMatching(input);
    return result;
  } catch (error) {
    console.error("Error in smartTutorMatching flow:", error);
    // Return a structured error or re-throw
    throw new Error("Failed to get tutor suggestions from AI.");
  }
}
