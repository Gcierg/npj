
import { GoogleGenAI } from "@google/genai";
import type { UserLocation, GroundingChunk } from '../types';
import type { Language } from '../translations';

if (!process.env.API_KEY) {
    // This is a placeholder for development.
    // In a real environment, the API key should be securely managed.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = "gemini-2.5-flash";

export const getCareerAdvice = async (
  userInput: string,
  location: UserLocation | null,
  language: Language
): Promise<{ text: string | undefined; groundingChunks: GroundingChunk[] }> => {

  const languageInstruction = language === 'es'
    ? "Your entire response, including all markdown formatting, headings, and content, MUST be in Spanish."
    : "Your entire response, including all markdown formatting, headings, and content, MUST be in English.";

  const prompt = `
    ${languageInstruction}

    You are "Career Compass AI", a highly empathetic, encouraging, and knowledgeable career coach. Your user is currently unemployed and seeking motivation and guidance.

    Your primary goals are to:
    1.  Acknowledge and validate their feelings and situation based on their input.
    2.  Provide actionable, optimistic, and personalized advice.
    3.  Suggest a variety of paths they could explore:
        -   Switching careers based on their stated or implied skills/experience.
        -   Specific job titles to search for.
        -   Areas of study or specific online courses (e.g., Coursera, edX).
        -   How they could leverage AI tools for their job search or skill development.
        -   Ideas for starting a small business or freelance work.
        -   Networking strategies, including volunteering or joining local groups.
    4.  Use Google Search and Google Maps to ground your suggestions with real, up-to-date, and relevant local information where applicable (e.g., "Here are some tech meetups near you," or "Here are top-rated online courses for project management").

    User's situation:
    ---
    ${userInput}
    ---

    Provide a response in well-structured markdown format. Use headings, bullet points, and bold text to make it easy to read. Be compassionate and inspiring.
  `;
    
  const config: any = {
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
  };
    
  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text: response.text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
};
