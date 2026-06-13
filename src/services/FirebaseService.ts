import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, auth, functions } from '../firebase';
import { UserProfile, DailyLog } from '../types';

export const FirebaseService = {
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
    const submitDailyLog = httpsCallable<{ log: Partial<DailyLog> }, { success: boolean; log: DailyLog; updates: any }>(functions, 'submitDailyLog');
    const result = await submitDailyLog({ log });
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
  }
};
