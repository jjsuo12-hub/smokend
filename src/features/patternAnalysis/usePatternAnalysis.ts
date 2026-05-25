import { useEffect, useMemo, useState } from 'react';
import { getChecklistRecords } from '@/storage/smokingStorage';
import { ChecklistRecord } from '@/types/smoking';
import { createPatternAnalysisSummary, filterRecordsByPeriod } from './patternAnalysisUtils';
import { AnalysisPeriod } from './types';

export function usePatternAnalysis(refreshKey: number) {
  const [period, setPeriod] = useState<AnalysisPeriod>('all');
  const [records, setRecords] = useState<ChecklistRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      setLoading(true);
      const savedRecords = await getChecklistRecords();
      setRecords(savedRecords);
      setLoading(false);
    }

    void loadRecords();
  }, [refreshKey]);

  const filteredRecords = useMemo(() => filterRecordsByPeriod(records, period), [records, period]);
  const summary = useMemo(() => createPatternAnalysisSummary(filteredRecords), [filteredRecords]);

  return {
    loading,
    period,
    setPeriod,
    records,
    filteredRecords,
    summary,
  };
}
