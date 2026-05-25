import { ChecklistRecord } from '@/types/smoking';
import { AnalysisPeriod, HaltSignal, PatternAnalysisSummary, RecommendedAction, TimeBucket } from './types';

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
