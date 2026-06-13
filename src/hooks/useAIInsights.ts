import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { calculateFlagDNA, generateWeeklyRoast, generateFlagForecast } from '../services/AnalyticsService';
import { useLogs } from '../contexts/LogsContext';
import { useProfile } from '../contexts/ProfileContext';

export interface AIInsights {
  personalizedRecommendations?: {
    biggestRedFlag: string;
    biggestGreenFlag: string;
    improvementAction: string;
  };
  weeklyReport?: {
    improvementSummary: string;
    biggestWin: string;
    nextGoal: string;
  };
  flagDNA?: {
    primaryTrait: string;
    identityExplanation: string;
  };
  weeklyForecast?: {
    likelyWeakArea: string;
    suggestedChallenge: string;
  };
}

export function useAIInsights() {
  const { user } = useAuth();
  const { logs } = useLogs();
  const { profile } = useProfile();
  
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!user || !profile) {
      setIsLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (import.meta.env.DEV) {
          throw new Error("DEV MODE: Bypassing generateAIInsights to prevent CORS errors");
        }
        const generateAIInsights = httpsCallable<{ forceRefresh?: boolean }, any>(functions, 'generateAIInsights');
        // Do not force refresh by default, let the backend handle the 7-day/1-day cache logic
        const result = await generateAIInsights({});
        
        if (isMounted) {
          setInsights(result.data);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!import.meta.env.DEV) {
          console.error("Failed to fetch AI insights, falling back to local AnalyticsService", err);
        }
        if (isMounted) {
          // Graceful fallback to existing hardcoded logic, mapping to new schema
          const localRoast = generateWeeklyRoast(logs);
          const localForecast = generateFlagForecast(logs, profile);
          const localDNA = calculateFlagDNA(logs);
          
          setInsights({
            personalizedRecommendations: {
              biggestRedFlag: localRoast.realityCheck,
              biggestGreenFlag: localRoast.oneWin,
              improvementAction: localRoast.oneFix
            },
            weeklyReport: {
              improvementSummary: localRoast.roast,
              biggestWin: localRoast.oneWin,
              nextGoal: localRoast.oneFix
            },
            flagDNA: {
              primaryTrait: localDNA.primaryTrait,
              identityExplanation: localDNA.description
            },
            forecast: {
              prediction: localForecast.prediction,
              opportunity: localForecast.opportunity
            }
          } as any);
          setError(err);
          setIsLoading(false);
        }
      }
    };

    fetchInsights();

    return () => { isMounted = false; };
  }, [user, profile?.flagScore]); // re-run if profile score changes or user changes (which implies new logs might exist)

  const refreshInsights = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        throw new Error("DEV MODE: Bypassing generateAIInsights to prevent CORS errors");
      }
      const generateAIInsights = httpsCallable<{ forceRefresh?: boolean }, any>(functions, 'generateAIInsights');
      const result = await generateAIInsights({ forceRefresh: true });
      setInsights(result.data);
    } catch (err: any) {
      if (!import.meta.env.DEV) {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { insights, isLoading, error, refreshInsights };
}
