import { useEffect, useMemo, useState } from 'react';
import { getChecklistRecords, getJournalRecords } from '@/storage/smokingStorage';
import { ChecklistRecord, JournalRecord } from '@/types/smoking';
import { createPatternAnalysisSummary, createPeriodTrendAnalysis, filterRecordsByPeriod } from './patternAnalysisUtils';
import { AnalysisPeriod } from './types';

export function usePatternAnalysis(refreshKey: number) {
  const [period, setPeriod] = useState<AnalysisPeriod>('all');
  const [records, setRecords] = useState<ChecklistRecord[]>([]);
  const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      setLoading(true);
      const [savedRecords, savedJournalRecords] = await Promise.all([getChecklistRecords(), getJournalRecords()]);
      setRecords(savedRecords);
      setJournalRecords(savedJournalRecords);
      setLoading(false);
    }

    void loadRecords();
  }, [refreshKey]);

  const filteredRecords = useMemo(() => filterRecordsByPeriod(records, period), [records, period]);
  const summary = useMemo(() => createPatternAnalysisSummary(filteredRecords), [filteredRecords]);
  const sevenDayAnalysis = useMemo(() => createPeriodTrendAnalysis(records, journalRecords, 7), [records, journalRecords]);
  const thirtyDayAnalysis = useMemo(() => createPeriodTrendAnalysis(records, journalRecords, 30), [records, journalRecords]);

  return {
    loading,
    period,
    setPeriod,
    records,
    journalRecords,
    filteredRecords,
    summary,
    sevenDayAnalysis,
    thirtyDayAnalysis,
  };
}
