import { ChecklistRecord, JournalRecord } from '@/types/smoking';
import { toDateKey } from '@/utils/date';
import {
  AnalysisPeriod,
  DailyChecklistUsage,
  DailyJournalCravingResult,
  HaltSignal,
  PatternAnalysisSummary,
  PeriodTrendAnalysis,
  RecommendedAction,
  PeriodComparisonMetric,
  TimeBucket,
} from './types';

const haltPriority: HaltSignal[] = ['Hungry', 'Angry', 'Lonely', 'Tired'];

const haltRecordKeys: Record<HaltSignal, keyof ChecklistRecord['halt']> = {
  Hungry: 'hungry',
  Angry: 'angry',
  Lonely: 'lonely',
  Tired: 'tired',
};

const timeBuckets: TimeBucket[] = Array.from({ length: 12 }, (_, index) => {
  const startHour = index * 2;
  const endHour = startHour + 2;
  return {
    id: `${startHour}-${endHour}`,
    startHour,
    endHour,
    label: `${formatHour(startHour)}~${formatHour(endHour)}`,
  };
});

export function getTimeBucketFromDate(date: string | Date): TimeBucket {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const hour = Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getHours();
  const bucketIndex = Math.floor(hour / 2);
  return timeBuckets[bucketIndex] ?? timeBuckets[0];
}

export function getMostFrequentTimeBucket(records: ChecklistRecord[]): TimeBucket | null {
  if (!records.length) {
    return null;
  }

  const counts = new Map<string, { bucket: TimeBucket; count: number; latestTime: number }>();

  records.forEach((record) => {
    const bucket = getTimeBucketFromRecord(record);
    const recordTime = getRecordTimestamp(record);
    const current = counts.get(bucket.id);
    counts.set(bucket.id, {
      bucket,
      count: (current?.count ?? 0) + 1,
      latestTime: Math.max(current?.latestTime ?? 0, recordTime),
    });
  });

  return [...counts.values()].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return b.latestTime - a.latestTime;
  })[0]?.bucket ?? null;
}

export function getMostFrequentHaltSignal(records: ChecklistRecord[]): HaltSignal | null {
  if (!records.length) {
    return null;
  }

  const counts = haltPriority.reduce<Record<HaltSignal, number>>(
    (acc, signal) => ({ ...acc, [signal]: 0 }),
    { Hungry: 0, Angry: 0, Lonely: 0, Tired: 0 },
  );

  records.forEach((record) => {
    haltPriority.forEach((signal) => {
      if (record.halt[haltRecordKeys[signal]]) {
        counts[signal] += 1;
      }
    });
  });

  const topSignal = [...haltPriority].sort((a, b) => counts[b] - counts[a])[0];
  return counts[topSignal] > 0 ? topSignal : null;
}

export function getAverageUrgeScore(records: ChecklistRecord[]): number | null {
  if (!records.length) {
    return null;
  }

  const validScores = records
    .map((record) => record.cravingScore)
    .filter((score) => Number.isFinite(score));

  if (!validScores.length) {
    return null;
  }

  const total = validScores.reduce((sum, score) => sum + score, 0);
  return Math.round((total / validScores.length) * 10) / 10;
}

export function getMostRecommendedAction(records: ChecklistRecord[]): RecommendedAction | null {
  const counts = new Map<string, { action: RecommendedAction; count: number }>();

  records.forEach((record) => {
    record.recommendedActions.forEach((action) => {
      const current = counts.get(action.title);
      counts.set(action.title, {
        action,
        count: (current?.count ?? 0) + 1,
      });
    });
  });

  return [...counts.values()].sort((a, b) => b.count - a.count)[0]?.action ?? null;
}

export function filterRecordsByPeriod(records: ChecklistRecord[], period: AnalysisPeriod): ChecklistRecord[] {
  if (period === 'all') {
    return records;
  }

  const now = new Date();
  const days = period === '7d' ? 7 : 30;
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  return records.filter((record) => getRecordTimestamp(record) >= startDate.getTime());
}

export function createPatternAnalysisSummary(records: ChecklistRecord[]): PatternAnalysisSummary {
  return {
    totalRecords: records.length,
    mostFrequentTimeBucket: getMostFrequentTimeBucket(records)?.label ?? null,
    mostFrequentHaltSignal: getMostFrequentHaltSignal(records),
    averageUrgeScore: getAverageUrgeScore(records),
    mostRecommendedAction: getMostRecommendedAction(records),
  };
}

export function createPeriodTrendAnalysis(
  checklistRecords: ChecklistRecord[],
  journalRecords: JournalRecord[],
  days: number,
  now = new Date(),
): PeriodTrendAnalysis {
  const currentDates = getDateRange(now, days);
  const previousDates = getDateRange(addLocalDays(now, -days), days);
  const checklistUsage = createDailyChecklistUsage(checklistRecords, currentDates);
  const journalCravingResults = createDailyJournalCravingResults(journalRecords, currentDates);
  const previousChecklistUsage = createDailyChecklistUsage(checklistRecords, previousDates);
  const previousJournalCravingResults = createDailyJournalCravingResults(journalRecords, previousDates);

  return {
    days,
    checklistUsage,
    journalCravingResults,
    comparisonMetrics: createPeriodComparisonMetrics(
      checklistUsage,
      previousChecklistUsage,
      journalCravingResults,
      previousJournalCravingResults,
      checklistRecords,
      currentDates,
      previousDates,
    ),
  };
}

export function createDailyChecklistUsage(records: ChecklistRecord[], dates: Date[]): DailyChecklistUsage[] {
  return dates.map((date) => {
    const dateKey = toDateKey(date);
    return {
      date: dateKey,
      label: formatShortDate(date),
      count: records.filter((record) => record.date === dateKey || toDateKey(new Date(record.createdAt)) === dateKey).length,
    };
  });
}

export function createDailyJournalCravingResults(records: JournalRecord[], dates: Date[]): DailyJournalCravingResult[] {
  return dates.map((date) => {
    const dateKey = toDateKey(date);
    const dayRecords = records.filter((record) => record.date === dateKey || toDateKey(new Date(record.createdAt)) === dateKey);
    return {
      date: dateKey,
      label: formatShortDate(date),
      resistedCount: dayRecords.filter((record) => record.resistedSmoking).length,
      failedCount: dayRecords.filter((record) => record.failedToResistSmoking).length,
    };
  });
}

function getTimeBucketFromRecord(record: ChecklistRecord) {
  if (record.createdAt) {
    return getTimeBucketFromDate(record.createdAt);
  }

  const hour = Number(record.time.split(':')[0]);
  return timeBuckets[Math.floor(hour / 2)] ?? timeBuckets[0];
}

function getRecordTimestamp(record: ChecklistRecord) {
  const createdAtTime = new Date(record.createdAt).getTime();
  if (!Number.isNaN(createdAtTime)) {
    return createdAtTime;
  }

  const fallbackTime = new Date(`${record.date}T${record.time || '00:00'}`).getTime();
  return Number.isNaN(fallbackTime) ? 0 : fallbackTime;
}

function formatHour(hour: number) {
  if (hour === 0) {
    return '오전 0시';
  }
  if (hour < 12) {
    return `오전 ${hour}시`;
  }
  if (hour === 12) {
    return '오후 12시';
  }
  if (hour === 24) {
    return '오전 0시';
  }
  return `오후 ${hour - 12}시`;
}

function createPeriodComparisonMetrics(
  currentChecklistUsage: DailyChecklistUsage[],
  previousChecklistUsage: DailyChecklistUsage[],
  currentJournalResults: DailyJournalCravingResult[],
  previousJournalResults: DailyJournalCravingResult[],
  checklistRecords: ChecklistRecord[],
  currentDates: Date[],
  previousDates: Date[],
): PeriodComparisonMetric[] {
  const currentDateKeys = new Set(currentDates.map(toDateKey));
  const previousDateKeys = new Set(previousDates.map(toDateKey));
  const currentChecklistRecords = checklistRecords.filter((record) => currentDateKeys.has(record.date));
  const previousChecklistRecords = checklistRecords.filter((record) => previousDateKeys.has(record.date));

  return [
    {
      label: '체크리스트 사용',
      previousValue: sumDailyChecklistUsage(previousChecklistUsage),
      currentValue: sumDailyChecklistUsage(currentChecklistUsage),
      unit: '회',
    },
    {
      label: '평균 흡연 충동 점수',
      previousValue: getAverageUrgeScore(previousChecklistRecords) ?? 0,
      currentValue: getAverageUrgeScore(currentChecklistRecords) ?? 0,
      unit: '점',
    },
    {
      label: '흡연욕구 참아낸 횟수',
      previousValue: sumDailyJournalValue(previousJournalResults, 'resistedCount'),
      currentValue: sumDailyJournalValue(currentJournalResults, 'resistedCount'),
      unit: '회',
    },
    {
      label: '참아내지 못한 횟수',
      previousValue: sumDailyJournalValue(previousJournalResults, 'failedCount'),
      currentValue: sumDailyJournalValue(currentJournalResults, 'failedCount'),
      unit: '회',
    },
  ];
}

function getDateRange(endDate: Date, days: number) {
  return Array.from({ length: days }, (_, index) => addLocalDays(startOfLocalDay(endDate), index - (days - 1)));
}

function addLocalDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatShortDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function sumDailyChecklistUsage(values: DailyChecklistUsage[]) {
  return values.reduce((sum, item) => sum + item.count, 0);
}

function sumDailyJournalValue(values: DailyJournalCravingResult[], key: 'resistedCount' | 'failedCount') {
  return values.reduce((sum, item) => sum + item[key], 0);
}
