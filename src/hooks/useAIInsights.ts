import { useState, useEffect } from 'react';
import { GeminiService } from '../utils/GeminiService';
import { useAuth } from '../contexts/AuthContext';
import { calculateFlagDNA, generateWeeklyRoast, generateFlagForecast } from '../services/AnalyticsService';
import { useLogs } from '../contexts/LogsContext';
import { useProfile } from '../contexts/ProfileContext';

export interface AIInsights {
  weeklySummary?: string;
  biggestWin?: string;
  improvementArea?: string;
  recommendation?: string;
  challenge?: string;
  encouragement?: string;
  flagDNA?: {
    primaryTrait: string;
    identityExplanation: string;
  };
  weeklyRoast?: string;
  forecast?: {
    prediction: string;
    opportunity: string;
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
        const result = await GeminiService.generateInsights(logs, profile);
        
        if (result) {
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
            weeklySummary: localRoast.roast,
            biggestWin: localRoast.oneWin,
            improvementArea: localRoast.realityCheck,
            recommendation: localRoast.oneFix,
            challenge: localForecast.suggestedChallenge || "Keep logging daily",
            encouragement: "Stay consistent!",
            flagDNA: {
              primaryTrait: localDNA.primaryTrait,
              identityExplanation: localDNA.description
            },
            weeklyRoast: localRoast.roast,
            forecast: {
              prediction: localForecast.prediction,
              opportunity: localForecast.opportunity
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
