import { GoogleGenAI } from '@google/genai';
import { DailyLog, UserProfile } from '../types';

export class GeminiService {
  static async generateInsights(logs: Record<string, DailyLog>, profile: UserProfile) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is missing. Falling back to default engine.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Summarize behavior for AI
    const logsList = Object.values(logs).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentLogs = logsList.slice(0, 14); // Use last 14 days
    let deliveries = 0, cabs = 0, acHeavy = 0, walks = 0, homeFood = 0;
    
    recentLogs.forEach(l => {
      if (l.delivery === 'once' || l.delivery === 'multiple') deliveries++;
      if (l.transport === 'cab' || l.transport === 'car') cabs++;
      if (l.energyAC === '6+h' || l.energyAC === '2-6h') acHeavy++;
      if (l.transport === 'walk' || l.transport === 'cycle' || l.transport === 'bus') walks++;
      if (l.foodSource === 'home' || l.foodSource === 'mess' || l.food === 'home' || l.food === 'mess') homeFood++;
    });

    const prompt = `
      You are the FLAGGED sustainability AI coach. Analyze the user's habits and generate insights.
      User Profile: Score: ${profile.flagScore}, Streak: ${profile.streak} days.
      Last 14 days summary:
      - ${deliveries} food deliveries
      - ${cabs} private cab rides
      - ${acHeavy} days of heavy AC usage
      - ${walks} days using green transport (walk/cycle/bus)
      - ${homeFood} days eating home/mess food instead of ordering out
      
      Generate a JSON response EXACTLY in this format, with NO markdown formatting, just raw JSON:
      {
        "weeklySummary": "1-2 sentences summarizing their performance compared to ideal",
        "biggestWin": "Short specific good habit",
        "improvementArea": "Short specific bad habit",
        "recommendation": "One highly specific, easy action to improve",
        "challenge": "A short actionable task to overcome a weak area",
        "encouragement": "A short, positive encouragement sentence",
        "flagDNA": {
          "primaryTrait": "A catchy 2-3 word title (e.g. Eco Explorer, Thrift Legend, Cab Addict)",
          "identityExplanation": "Why they got this identity based on their actual logs."
        },
        "weeklyRoast": "A funny, slightly sarcastic roast about their worst green habit this week.",
        "forecast": {
          "prediction": "A prediction of how next week will go.",
          "opportunity": "An opportunity to save emissions next week."
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
