/**
 * @module GeminiService
 * @description
 * Handles the secure integration with the Google Gemini AI API to generate "Gen-Z" personalized insights.
 * 
 * AI DATA FLOW & SECURITY ARCHITECTURE:
 * 1. Data Ingestion: Accepts raw NoSQL logs from Firestore.
 * 2. Sanitization (InsightEngine): Raw logs are NOT sent to the AI. Instead, they are passed to the 
 *    pure `InsightEngine` which scrubs personal notes and reduces 14 days of logs into 5 anonymous, aggregate integers (e.g., deliveries=3, walks=5).
 * 3. Prompt Engineering: The sanitized integers are injected into a highly specific system prompt requesting a strict JSON response.
 * 4. API Request: The prompt is sent to `gemini-2.5-flash` using a secure API key injected at build time via Vite (`import.meta.env`).
 * 5. Parsing & Return: The raw string response is parsed into a strictly typed JSON object containing the `vibeCheck` and `mainQuest` UI elements.
 */
import { GoogleGenAI } from '@google/genai';
import { DailyLog, UserProfile } from '../types';
import { InsightEngine } from './InsightEngine';

export class GeminiService {
  static async generateInsights(logs: Record<string, DailyLog>, profile: UserProfile) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is missing. Falling back to default engine.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Summarize behavior for AI using the highly-testable InsightEngine
    const summary = InsightEngine.summarizeLogsForInsights(logs);
    const { deliveries, cabs, acHeavy, walks, homeFood } = summary;

    const prompt = `
      You are the FLAGGED sustainability AI coach. You MUST speak like a chronically online Gen Z bestie. Use slang like "W", "L", "cooked", "serving", "no cap", "slay", "era", "aura", etc. Keep sentences extremely short and punchy. Be slightly sarcastic but encouraging.

      User Profile: Score: ${profile.flagScore}, Streak: ${profile.streak} days.
      Last 14 days summary:
      - ${deliveries} food deliveries
      - ${cabs} private cab rides
      - ${acHeavy} days of heavy AC usage
      - ${walks} days using green transport (walk/cycle/bus)
      - ${homeFood} days eating home/mess food instead of ordering out
      
      Generate a JSON response EXACTLY in this format, with NO markdown formatting, just raw JSON:
      {
        "vibeCheck": "2-3 short Gen Z sentences roasting or praising their overall vibe based on the stats.",
        "mainQuest": "One highly specific, actionable challenge for this week to fix their worst habit. Make it sound like a video game quest.",
        "aura": {
          "title": "A catchy 1-2 word Gen Z title (e.g. 'Cooked Era', 'Eco Slay', 'Cab Addict')",
          "description": "1 sentence explaining why their aura is like this."
        }
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const aiOutput = response.text;
      if (aiOutput) {
        return JSON.parse(aiOutput);
      }
    } catch (error) {
      console.error("Gemini AI generation failed:", error);
      return null;
    }
    
    return null;
  }
}
