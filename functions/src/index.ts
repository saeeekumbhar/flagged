import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DailyLog, UserProfile } from "./types";
import { calculateDailyScore, calculateFlagScore, calculateTrend } from "./utils/ScoreEngine";
import { calculateDailyEmissions } from "./utils/CarbonService";

admin.initializeApp();
const db = admin.firestore();

export const submitDailyLog = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }
  const uid = context.auth.uid;
  const logData: Partial<DailyLog> = data.log;

  if (!logData || !logData.date) {
    throw new functions.https.HttpsError("invalid-argument", "Log date is required.");
  }

  // Prevent future dates
  const logDate = new Date(logData.date);
  logDate.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (logDate > today) {
    throw new functions.https.HttpsError("invalid-argument", "Cannot log future dates.");
  }

  // Calculate secure metrics
  const dailyScore = calculateDailyScore(logData);
  const totalCarbonEstimate = calculateDailyEmissions(logData);

  const finalLog: DailyLog = {
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
  const logs: Record<string, DailyLog> = {};
  logsSnap.forEach(docSnap => {
    logs[docSnap.id] = docSnap.data() as DailyLog;
  });

  const profRef = db.collection("users").doc(uid);
  const pSnap = await profRef.get();
  let xpAward = 0;
  let coinsAward = 0;

  if (dailyScore >= 50) {
    xpAward = 15;
    coinsAward = 5;
  } else {
    xpAward = 5;
  }

  if (pSnap.exists) {
    const profile = pSnap.data() as UserProfile;
    const { streak, bestStreak } = calculateTrend(logs);
    const flagScore = calculateFlagScore(logs);

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
  } else {
    return { success: true, log: finalLog, updates: null };
  }
});
