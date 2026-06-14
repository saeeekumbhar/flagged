import { useState, useEffect, useMemo } from 'react';
import { GeminiService } from '../utils/GeminiService';
import { useAuth } from '../contexts/AuthContext';
import { calculateFlagDNA, generateWeeklyRoast, generateFlagForecast } from '../services/AnalyticsService';
import { useLogs } from '../contexts/LogsContext';
import { useProfile } from '../contexts/ProfileContext';

export interface AIInsights {
  vibeCheck?: string;
  mainQuest?: string;
  aura?: {
    title: string;
    description: string;
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
        const CACHE_KEY = `flagged_ai_insights_${user.uid}`;
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            // 24 hours = 24 * 60 * 60 * 1000 = 86400000 ms
            if (Date.now() - timestamp < 86400000) {
              if (isMounted) {
                setInsights(data);
                setIsLoading(false);
              }
              return;
            }
          } catch (e) {
            console.warn("Invalid cache for insights", e);
          }
        }

        const result = await GeminiService.generateInsights(logs, profile);
        
        if (result) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
          if (isMounted) {
            setInsights(result);
            setIsLoading(false);
          }
        } else {
          throw new Error("Gemini returned null");
        }
      } catch (err: any) {
        console.warn("Falling back to local AnalyticsService", err);
        if (isMounted) {
          // Graceful fallback to existing hardcoded logic, mapping to new schema
          const localRoast = generateWeeklyRoast(logs);
          const localForecast = generateFlagForecast(logs, profile);
          const localDNA = calculateFlagDNA(logs);
          
          setInsights({
            vibeCheck: localRoast.roast,
            mainQuest: localForecast.suggestedChallenge || localRoast.oneFix || "Log daily to slay your emissions.",
            aura: {
              title: localDNA.primaryTrait,
              description: localDNA.description
            }
          });
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
      const result = await GeminiService.generateInsights(logs, profile);
      if (result) {
        localStorage.setItem(`flagged_ai_insights_${user.uid}`, JSON.stringify({ data: result, timestamp: Date.now() }));
        setInsights(result);
      }
    } catch (err: any) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { insights, isLoading, error, refreshInsights };
}
