// gemini.ts

import { GoogleGenAI } from '@google/genai';
import { Platform } from 'react-native';

// --- Configuration ---
// Retrieve the API key from environment variables (Make sure .env file is updated and server restarted)
const GEMINI_API_KEY = Platform.select({
  default: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
});

// Initialize the AI client outside the function, only if the key exists.
// We'll handle the missing key error inside the exported function.
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

/**
 * Calls the Gemini API to generate content based on a command and existing note.
 * Handles API key validation and content generation logic.
 * @param command The user's instruction (e.g., 'Summarize this').
 * @param existingContent The full content of the note being edited.
 * @returns The new generated content string.
 */
export async function generateContent(
  command: string,
  existingContent: string,
): Promise<string> {
    
  if (!ai) {
    // If API key is missing, return a clear error message instead of crashing
    console.error("Error: GEMINI_API_KEY is missing. Please check your .env file and restart the server.");
    return `AI ERROR: Gemini API Key is missing. Cannot process command: "${command}". 
    
Please verify that you have created the .env file with EXPO_PUBLIC_GEMINI_API_KEY and restarted your Expo server.`;
  }

  // This system instruction tells the AI how to behave (to replace/append based on command)
  const systemInstruction = `You are a professional writing assistant and editor for a mobile app. Your task is to process the user's command against the 'Existing Content'.
    - If the command implies summarizing, translating, or rewriting (e.g., 'summarize', 'translate to French', 'rewrite this'), you MUST output ONLY the new, generated text that replaces the old content.
    - If the command implies adding or expanding (e.g., 'expand', 'add details about X'), you MUST output the complete text, which is the original content followed by the new, generated details.
    - Be realistic, professional, and directly follow the user command. Do not include conversational filler (like 'Here is the generated text').`;

  const prompt = `User Command: "${command}"

Existing Content to Edit:
---
${existingContent}
---

Generate the complete, final output text:`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7, 
        },
    });

    // Fix for type warning: Use optional chaining (?.) and provide a fallback.
    const generatedText = response.text?.trim() || "AI generated an empty response. Please try refining your command.";
    
    return generatedText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `AI ERROR: Could not execute command due to a connection or API issue.`;
  }
}