"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIInsights = exports.submitDailyLog = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
const ScoreEngine_1 = require("./utils/ScoreEngine");
const CarbonService_1 = require("./utils/CarbonService");
admin.initializeApp();
const db = admin.firestore();
// Initialize Gemini. In production, use Firebase Secrets or env vars.
const geminiApiKey = process.env.GEMINI_API_KEY || "YOUR_FALLBACK_API_KEY";
const ai = new genai_1.GoogleGenAI({ apiKey: geminiApiKey });
exports.submitDailyLog = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
    }
    const uid = context.auth.uid;
    const logData = data.log;
    if (!logData || !logData.date) {
        throw new functions.https.HttpsError("invalid-argument", "Log date is required.");
    }
    // Prevent future dates
    const logDate = new Date(logData.date);
    logDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (logDate > today) {
        throw new functions.https.HttpsError("invalid-argument", "Cannot log future dates.");
    }
    // Calculate secure metrics
    const dailyScore = (0, ScoreEngine_1.calculateDailyScore)(logData);
    const totalCarbonEstimate = (0, CarbonService_1.calculateDailyEmissions)(logData);
    const finalLog = {
        date: logData.date,
        transport: logData.transport,
        foodSource: logData.foodSource,
        foodDiet: logData.foodDiet,
        delivery: logData.delivery,
        energyLaptop: logData.energyLaptop,
        energyAC: logData.energyAC,
        shopping: logData.shopping,
        notes: logData.notes || "",
        dailyScore,
        totalCarbonEstimate
    };
    // 1. Save Log
    const logRef = db.collection("users").doc(uid).collection("dailyLogs").doc(finalLog.date);
    await logRef.set(finalLog, { merge: true });
    // 2. Recalculate User Profile
    const logsSnap = await db.collection("users").doc(uid).collection("dailyLogs").get();
    const logs = {};
    logsSnap.forEach(docSnap => {
        logs[docSnap.id] = docSnap.data();
    });
    const profRef = db.collection("users").doc(uid);
    const pSnap = await profRef.get();
    let xpAward = 0;
    let coinsAward = 0;
    if (dailyScore >= 50) {
        xpAward = 15;
        coinsAward = 5;
    }
    else {
        xpAward = 5;
    }
    if (pSnap.exists) {
        const profile = pSnap.data();
        const { streak, bestStreak } = (0, ScoreEngine_1.calculateTrend)(logs);
        const flagScore = (0, ScoreEngine_1.calculateFlagScore)(logs);
        let newXp = (profile.xp || 0) + xpAward;
        let newCoins = (profile.coins || 0) + coinsAward;
        let newLevel = profile.level || 1;
        while (newXp >= 1000) {
            newLevel++;
            newXp -= 1000;
        }
        const updates = {
            flagScore,
            streak,
            bestStreak: Math.max(bestStreak, profile.bestStreak || 0),
            xp: newXp,
            coins: newCoins,
            level: newLevel
        };
        await profRef.set(updates, { merge: true });
        return { success: true, log: finalLog, updates };
    }
    else {
        return { success: true, log: finalLog, updates: null };
    }
});
exports.generateAIInsights = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
    }
    const uid = context.auth.uid;
    const forceRefresh = data.forceRefresh || false;
    const insightsRef = db.collection("users").doc(uid).collection("aiInsights").doc("latest");
    const iSnap = await insightsRef.get();
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * ONE_DAY;
    let cachedData = iSnap.exists ? iSnap.data() : null;
    // Check cache validity
    let needsWeeklyUpdate = false;
    let needsDailyUpdate = false;
    if (!cachedData) {
        needsWeeklyUpdate = true;
        needsDailyUpdate = true;
    }
    else {
        if (forceRefresh || !cachedData.generatedAt || (now - cachedData.generatedAt > SEVEN_DAYS)) {
            needsWeeklyUpdate = true;
        }
        if (forceRefresh || !cachedData.updatedAt || (now - cachedData.updatedAt > ONE_DAY)) {
            needsDailyUpdate = true;
        }
    }
    if (!needsWeeklyUpdate && !needsDailyUpdate) {
        return cachedData;
    }
    // Fetch logs and profile for context
    const logsSnap = await db.collection("users").doc(uid).collection("dailyLogs").get();
    const logsList = [];
    logsSnap.forEach(docSnap => logsList.push(docSnap.data()));
    logsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const profRef = db.collection("users").doc(uid);
    const pSnap = await profRef.get();
    const profile = pSnap.data();
    // Summarize behavior for AI
    const recentLogs = logsList.slice(0, 14); // Use last 14 days
    let deliveries = 0, cabs = 0, acHeavy = 0, walks = 0, homeFood = 0;
    recentLogs.forEach(l => {
        if (l.delivery === 'once' || l.delivery === 'multiple')
            deliveries++;
        if (l.transport === 'cab' || l.transport === 'car')
            cabs++;
        if (l.energyAC === '6+h' || l.energyAC === '2-6h')
            acHeavy++;
        if (l.transport === 'walk' || l.transport === 'cycle' || l.transport === 'bus')
            walks++;
        if (l.foodSource === 'home' || l.foodSource === 'mess' || l.food === 'home' || l.food === 'mess')
            homeFood++;
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
      ${needsWeeklyUpdate ? `
      "flagDNA": {
        "primaryTrait": "A catchy 2-3 word title (e.g. Eco Explorer, Thrift Legend, Cab Addict)",
        "description": "One sentence explaining their vibe.",
        "scores": { "transport": 1-5, "food": 1-5, "energy": 1-5, "shopping": 1-5, "community": 1-5 }
      },
      "weeklyRoast": {
        "roast": "A slightly sassy, funny comment about their bad habits.",
        "realityCheck": "A factual statement about the impact of their worst habit.",
        "oneFix": "One highly specific, easy action to improve.",
        "oneWin": "Praise for their best green habit."
      },
      "forecast": {
        "prediction": "A short prediction of next week's score based on trends.",
        "opportunity": "What they are missing out on.",
        "suggestedChallenge": "A short actionable task."
      },
      ` : ''}
      ${needsDailyUpdate ? `
      "dailyInsight": "A short 1-sentence nudge based on today."
      ` : ''}
    }
  `;
    let newInsights = {};
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
            newInsights = JSON.parse(aiOutput);
        }
    }
    catch (error) {
        console.error("Gemini AI generation failed:", error);
        if (!cachedData) {
            throw new functions.https.HttpsError("internal", "AI Generation Failed and no cache exists.");
        }
        return cachedData; // fallback to cache silently
    }
    const updatedData = Object.assign(Object.assign(Object.assign({}, cachedData), newInsights), { updatedAt: now, generatedAt: needsWeeklyUpdate ? now : ((cachedData === null || cachedData === void 0 ? void 0 : cachedData.generatedAt) || now) });
    await insightsRef.set(updatedData, { merge: true });
    return updatedData;
});
//# sourceMappingURL=index.js.map