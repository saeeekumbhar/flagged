import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyLog } from '../types';
import { useAuth } from './AuthContext';
import { FirebaseService } from '../services/FirebaseService';

interface LogsContextType {
  logs: Record<string, DailyLog>;
  addLog: (log: DailyLog) => Promise<void>;
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

  const addLog = async (log: DailyLog) => {
    setLogs(prev => ({ ...prev, [log.date]: log }));
    if (user) {
      try {
        await FirebaseService.saveLog(user.uid, log);
      } catch (e) {
        console.warn("Failed to save log:", e);
      }
    }
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
