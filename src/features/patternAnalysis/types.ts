import { CopingAction } from '@/types/smoking';

export type AnalysisPeriod = 'all' | '7d' | '30d';

export type HaltSignal = 'Hungry' | 'Angry' | 'Lonely' | 'Tired';

export type TimeBucket = {
  id: string;
  startHour: number;
  endHour: number;
  label: string;
};

export type RecommendedAction = CopingAction;

export type DailyChecklistUsage = {
  date: string;
  label: string;
  count: number;
};

export type DailyJournalCravingResult = {
  date: string;
  label: string;
  resistedCount: number;
  failedCount: number;
};

export type PeriodComparisonMetric = {
  label: string;
  previousValue: number;
  currentValue: number;
  unit: string;
};

export type PeriodTrendAnalysis = {
  days: number;
  checklistUsage: DailyChecklistUsage[];
  journalCravingResults: DailyJournalCravingResult[];
  comparisonMetrics: PeriodComparisonMetric[];
};

export type ActionEffectRecord = {
  beforeUrgeScore: number;
  afterUrgeScore: number;
  scoreDelta: number;
  actionTried: string;
  completedAt: string;
};

export type PatternAnalysisSummary = {
  totalRecords: number;
  mostFrequentTimeBucket: string | null;
  mostFrequentHaltSignal: HaltSignal | null;
  averageUrgeScore: number | null;
  mostRecommendedAction: RecommendedAction | null;
};
