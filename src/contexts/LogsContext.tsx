import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyLog } from '../types';
import { useAuth } from './AuthContext';
import { FirebaseService } from '../services/FirebaseService';

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
      try {
        const result = await FirebaseService.saveLog(user.uid, log);
        if (result && result.success) {
          setLogs(prev => ({ ...prev, [result.log.date]: result.log }));
          return result;
        }
      } catch (e) {
        console.warn("Failed to save log via Function:", e);
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
