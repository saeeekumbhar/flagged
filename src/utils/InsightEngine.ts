import { DailyLog } from '../types';

export interface InsightSummary {
  deliveries: number;
  cabs: number;
  acHeavy: number;
  walks: number;
  homeFood: number;
}

export class InsightEngine {
  /**
   * Summarizes the last 14 days of user logs into key metrics for AI generation.
   * Filters out older logs and counts specific high/low impact behaviors.
   */
  static summarizeLogsForInsights(logs: Record<string, DailyLog> | undefined | null): InsightSummary {
    const summary: InsightSummary = {
      deliveries: 0,
      cabs: 0,
      acHeavy: 0,
      walks: 0,
      homeFood: 0
    };

    if (!logs || Object.keys(logs).length === 0) {
      return summary;
    }

    // Sort logs by date descending
    const logsList = Object.values(logs)
      .filter(l => l && l.date) // Ensure log and date exist
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
    // Use last 14 days
    const recentLogs = logsList.slice(0, 14); 
    
    recentLogs.forEach(l => {
      if (l.delivery === 'once' || l.delivery === 'multiple') summary.deliveries++;
      if (l.transport === 'cab' || l.transport === 'car') summary.cabs++;
      if (l.energyAC === '6+h' || l.energyAC === '2-6h') summary.acHeavy++;
      if (l.transport === 'walk' || l.transport === 'cycle' || l.transport === 'bus') summary.walks++;
      if (l.foodSource === 'home' || l.foodSource === 'mess' || l.food === 'home' || l.food === 'mess') summary.homeFood++;
    });

    return summary;
  }
}
