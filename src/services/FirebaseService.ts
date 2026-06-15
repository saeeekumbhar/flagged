/**
 * @module FirebaseService
 * @description
 * Primary data access layer for all Google Firebase and Cloud Firestore operations.
 * 
 * NO-SQL DATABASE STRUCTURE (FIRESTORE):
 * The database is strictly architected into isolated, user-specific subcollections to guarantee security 
 * via Firebase Security Rules. 
 * 
 * /users/{uid} (Document: UserProfile)
 *   -> Stores static user data, gamification state (coins, xp, streak), and preferences.
 * 
 * /users/{uid}/logs/{date_string} (Document: DailyLog)
 *   -> Subcollection storing daily event logs. Indexed by ISO date string (YYYY-MM-DD) for fast time-series queries.
 * 
 * /users/{uid}/settings/preferences (Document: Settings)
 *   -> Separate subcollection to handle push notification tokens and theme preferences without bloating the main profile.
 */
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { signInWithPopup, GoogleAuthProvider, signOut, deleteUser, onAuthStateChanged, User } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { db, auth, functions } from '../firebase';
import { UserProfile, DailyLog } from '../types';
import { calculateDailyScore, calculateTrend, calculateFlagScore } from '../utils/ScoreEngine';
import { calculateDailyEmissions } from '../../functions/src/utils/CarbonService';

export const FirebaseService = {
  // --- AUTHENTICATION ---
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  },

  signOutUser: async () => {
    return signOut(auth);
  },

  deleteAccount: async () => {
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          // Re-authenticate the user
          const { reauthenticateWithPopup, GoogleAuthProvider } = await import('firebase/auth');
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          await reauthenticateWithPopup(auth.currentUser, provider);
          // Try deleting again after successful re-authentication
          await deleteUser(auth.currentUser);
        } else {
          throw error;
        }
      }
    }
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUserId: () => {
    return auth.currentUser?.uid || null;
  },

  // --- ANALYTICS ---
  logAnalyticsEvent: async (eventName: string, params?: any) => {
    try {
      const { analytics } = await import('../firebase');
      if (analytics) {
        logEvent(analytics, eventName, params);
      }
    } catch (e) {
      console.warn("Analytics error", e);
    }
  },

  // --- NOTIFICATIONS ---
  updateUserFCMToken: async (uid: string, token: string) => {
    const profRef = doc(db, 'users', uid);
    await setDoc(profRef, { fcmToken: token, fcmTokenUpdatedAt: new Date().toISOString() }, { merge: true });
  },

  // --- PROFILE & LOGS ---
  getProfile: async (uid: string): Promise<UserProfile | null> => {
    const profRef = doc(db, 'users', uid);
    const pSnap = await getDoc(profRef);
    if (pSnap.exists()) {
      return pSnap.data() as UserProfile;
    }
    return null;
  },

  saveProfile: async (uid: string, profile: Partial<UserProfile>): Promise<void> => {
    const profRef = doc(db, 'users', uid);
    await setDoc(profRef, profile, { merge: true });
  },

  getLogs: async (uid: string): Promise<Record<string, DailyLog>> => {
    const logsSnap = await getDocs(collection(db, 'users', uid, 'dailyLogs'));
    const logs: Record<string, DailyLog> = {};
    logsSnap.forEach(docSnap => {
      const date = docSnap.id;
      logs[date] = docSnap.data() as DailyLog;
    });
    return logs;
  },

  saveLog: async (uid: string, log: Partial<DailyLog>): Promise<{ success: boolean; log: DailyLog; updates: any }> => {
    if (import.meta.env.DEV) {
      console.warn("DEV MODE: Bypassing Cloud Function entirely to avoid CORS errors.");
      if (!log.date) throw new Error("Date required");
      
      const dailyScore = calculateDailyScore(log);
      const totalCarbonEstimate = calculateDailyEmissions(log);
      
      const finalLog: DailyLog = {
        date: log.date, transport: log.transport, foodSource: log.foodSource,
        foodDiet: log.foodDiet, delivery: log.delivery, energyLaptop: log.energyLaptop,
        energyAC: log.energyAC, shopping: log.shopping, notes: log.notes || "",
        dailyScore, totalCarbonEstimate
      };
      
      const userRef = doc(db, "users", uid);
      const logRef = doc(userRef, "dailyLogs", finalLog.date);
      await setDoc(logRef, finalLog, { merge: true });
      
      const logsSnap = await getDocs(collection(userRef, "dailyLogs"));
      const currentLogs: Record<string, DailyLog> = {};
      logsSnap.forEach(d => { currentLogs[d.id] = d.data() as DailyLog; });
      
      const pSnap = await getDoc(userRef);
      let profile = pSnap.exists() ? pSnap.data() as UserProfile : { xp: 0, coins: 0, level: 1, bestStreak: 0, flagScore: 50 } as UserProfile;
      
      const { streak, bestStreak } = calculateTrend(currentLogs);
      const flagScore = calculateFlagScore(currentLogs);
      
      let xpAward = dailyScore >= 50 ? 15 : 5;
      let coinsAward = dailyScore >= 50 ? 5 : 0;
      let newXp = (profile.xp || 0) + xpAward;
      let newCoins = (profile.coins || 0) + coinsAward;
      let newLevel = profile.level || 1;
      
      while (newXp >= 1000) { newLevel++; newXp -= 1000; }
      
      const updates = { flagScore, streak, bestStreak: Math.max(bestStreak, profile.bestStreak || 0), xp: newXp, coins: newCoins, level: newLevel };
      await setDoc(userRef, updates, { merge: true });
      
      try { await deleteDoc(doc(db, "users", uid, "aiInsights", "latest")); } catch (e) {}
      
      return { success: true, log: finalLog, updates };
    }

    const submitDailyLog = httpsCallable<{ log: Partial<DailyLog> }, { success: boolean; log: DailyLog; updates: any }>(functions, 'submitDailyLog');
    const result = await submitDailyLog({ log });
    
    try { await deleteDoc(doc(db, "users", uid, "aiInsights", "latest")); } catch (e) {}
    
    return result.data;
  },

  deleteLog: async (uid: string, date: string): Promise<void> => {
    const logRef = doc(db, 'users', uid, 'dailyLogs', date);
    await deleteDoc(logRef);
  },

  migrateLocalData: async (uid: string): Promise<{ profile: UserProfile | null, logs: Record<string, DailyLog> }> => {
    const savedProfile = localStorage.getItem('flagged_profile');
    const savedLogs = localStorage.getItem('flagged_logs');
    
    let p: UserProfile | null = null;
    let l: Record<string, DailyLog> = {};
    let didMigrate = false;
    
    if (savedProfile) {
      try { 
        p = JSON.parse(savedProfile); 
        if (p) {
          p.uid = uid;
          p.email = auth.currentUser?.email || null;
          await FirebaseService.saveProfile(uid, p);
          didMigrate = true;
        }
      } catch(e) {}
    }
    
    if (savedLogs) {
       try { 
          l = JSON.parse(savedLogs); 
          for (const date in l) {
            await FirebaseService.saveLog(uid, l[date]);
          }
          didMigrate = true;
       } catch(e) {}
    }
    
    if (didMigrate) {
      localStorage.removeItem('flagged_profile');
      localStorage.removeItem('flagged_logs');
    }

    return { profile: p, logs: l };
  },

  awardManualXP: async (actionType: string): Promise<{updates: any}> => {
    const awardXP = httpsCallable<{actionType: string}, {updates: any}>(functions, 'awardManualXP');
    const result = await awardXP({ actionType });
    return result.data;
  }
};
