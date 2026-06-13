import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyLog, UserProfile } from '../types';
import { useAuth } from './AuthContext';
import { FirebaseService } from '../services/FirebaseService';
import { calculateDailyScore, calculateTrend, calculateFlagScore } from '../utils/ScoreEngine';
import { calculateDailyEmissions } from '../../functions/src/utils/CarbonService';
import { db } from '../firebase';
import { doc, collection, setDoc, getDoc, getDocs } from 'firebase/firestore';

interface LogsContextType {
  logs: Record<string, DailyLog>;
  addLog: (log: Partial<DailyLog>) => Promise<{ success: boolean; log: DailyLog; updates: any } | null>;
  isLogsLoading: boolean;
  setLogs: React.Dispatch<React.SetStateAction<Record<string, DailyLog>>>;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const LogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      if (!user) {
        setLogs({});
        setIsLogsLoading(false);
        return;
      }
      try {
        const fetchedLogs = await FirebaseService.getLogs(user.uid);
        if (isMounted) {
          setLogs(fetchedLogs);
          setIsLogsLoading(false);
        }
      } catch (e) {
        console.warn("Failed to fetch logs:", e);
        if (isMounted) setIsLogsLoading(false);
      }
    };

    fetchLogs();

    return () => { isMounted = false; };
  }, [user]);

  const addLog = async (log: Partial<DailyLog>) => {
    if (user) {
      // DEV-ONLY BYPASS: Process Gamification locally WITHOUT calling Cloud Function
      if (import.meta.env.DEV) {
        console.warn("DEV MODE: Bypassing Cloud Function entirely to avoid CORS errors.");
        
        if (!log.date) throw new Error("Date required");
        
        const dailyScore = calculateDailyScore(log);
        const totalCarbonEstimate = calculateDailyEmissions(log);
        
        const finalLog: DailyLog = {
          date: log.date,
          transport: log.transport,
          foodSource: log.foodSource,
          foodDiet: log.foodDiet,
          delivery: log.delivery,
          energyLaptop: log.energyLaptop,
          energyAC: log.energyAC,
          shopping: log.shopping,
          notes: log.notes || "",
          dailyScore,
          totalCarbonEstimate
        };
        
        const userRef = doc(collection(db, "users"), user.uid);
        const logRef = doc(collection(userRef, "dailyLogs"), finalLog.date);
        await setDoc(logRef, finalLog, { merge: true });
        
        const logsSnap = await getDocs(collection(userRef, "dailyLogs"));
        const currentLogs: Record<string, DailyLog> = {};
        logsSnap.forEach(d => {
           currentLogs[d.id] = d.data() as DailyLog;
        });
        
        const pSnap = await getDoc(userRef);
        let profile = pSnap.exists() ? pSnap.data() as UserProfile : { xp: 0, coins: 0, level: 1, bestStreak: 0, flagScore: 50 } as UserProfile;
        
        if (!pSnap.exists()) {
          console.warn("DEV MODE: User profile missing (likely due to missing Cloud Functions). Initializing local profile.");
        }
        
        const { streak, bestStreak } = calculateTrend(currentLogs);
        const flagScore = calculateFlagScore(currentLogs);
        
        let xpAward = dailyScore >= 50 ? 15 : 5;
        let coinsAward = dailyScore >= 50 ? 5 : 0;
        
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
        
        await setDoc(userRef, updates, { merge: true });
        
        setLogs(prev => ({ ...prev, [finalLog.date]: finalLog }));
        return { success: true, log: finalLog, updates };
      }

      try {
        const result = await FirebaseService.saveLog(user.uid, log);
        if (result && result.success) {
          setLogs(prev => ({ ...prev, [result.log.date]: result.log }));
          return result;
        }
      } catch (e) {
        if (!import.meta.env.DEV) {
          console.warn("Failed to save log via Function:", e);
        }
      }
    }
    return null;
  };

  return (
    <LogsContext.Provider value={{ logs, addLog, isLogsLoading, setLogs }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};
