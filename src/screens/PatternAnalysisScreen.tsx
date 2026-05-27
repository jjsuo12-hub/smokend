import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AnalysisCard } from '@/features/patternAnalysis/components/AnalysisCard';
import { EmptyAnalysisState } from '@/features/patternAnalysis/components/EmptyAnalysisState';
import { LineChartCard } from '@/features/patternAnalysis/components/LineChartCard';
import { PeriodFilter } from '@/features/patternAnalysis/components/PeriodFilter';
import { SevenDayComparisonCard } from '@/features/patternAnalysis/components/SevenDayComparisonCard';
import { HaltSignal } from '@/features/patternAnalysis/types';
import { usePatternAnalysis } from '@/features/patternAnalysis/usePatternAnalysis';
import { colors, spacing, typography } from '@/shared/styles';

type PatternAnalysisScreenProps = {
  refreshKey: number;
  onBack: () => void;
  onOpenChecklist: () => void;
};

const haltDescriptions: Record<HaltSignal, string> = {
  Hungry: '배가 고프거나 에너지가 부족한 상태',
  Angry: '화가 나거나 감정적으로 긴장한 상태',
  Lonely: '외롭거나 연결감이 부족한 상태',
  Tired: '수면이 부족하거나 육체적으로 피로한 상태',
};

const haltCardDescriptions: Record<HaltSignal, string> = {
  Hungry: '허기가 흡연 충동처럼 느껴질 수 있어요.',
  Angry: '감정이 높아질 때 잠깐 멈추는 연습이 도움이 돼요.',
  Lonely: '고립감이 들 때 짧은 연락이나 산책을 준비해보세요.',
  Tired: '피로가 쌓이면 흡연 충동으로 느껴질 수 있어요.',
};

const insufficientRecordText = '아직 분석할 기록이 부족해요';

export function PatternAnalysisScreen({ refreshKey, onBack, onOpenChecklist }: PatternAnalysisScreenProps) {
  const { loading, period, setPeriod, sevenDayAnalysis, thirtyDayAnalysis, summary } = usePatternAnalysis(refreshKey);
  const haltValue = summary.mostFrequentHaltSignal
    ? `${summary.mostFrequentHaltSignal}\n${haltDescriptions[summary.mostFrequentHaltSignal]}`
    : insufficientRecordText;
  const periodTrendAnalysis = period === '7d' ? sevenDayAnalysis : period === '30d' ? thirtyDayAnalysis : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>나의 흡연 패턴 분석</Text>
        <Text style={styles.description}>
          체크리스트 기록을 바탕으로 내가 언제, 어떤 상황에서 흡연 충동을 많이 느끼는지 확인할 수 있어요.
        </Text>
      </View>

      <PeriodFilter value={period} onChange={setPeriod} />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : periodTrendAnalysis ? (
        <View style={styles.cardList}>
          <SevenDayComparisonCard days={periodTrendAnalysis.days} metrics={periodTrendAnalysis.comparisonMetrics} />
          <LineChartCard
            title={`최근 ${periodTrendAnalysis.days}일 체크리스트 사용률`}
            description="흡연멈춰 체크리스트를 하루에 몇 번 사용했는지 보여줘요."
            labels={periodTrendAnalysis.checklistUsage.map((item) => item.label)}
            series={[
              {
                label: '체크리스트 사용',
                color: colors.primary,
                values: periodTrendAnalysis.checklistUsage.map((item) => item.count),
              },
            ]}
          />
          <LineChartCard
            title={`최근 ${periodTrendAnalysis.days}일 흡연욕구 대응 기록`}
            description="금연일기에서 흡연욕구를 참아낸 횟수와 참아내지 못한 횟수를 함께 보여줘요."
            labels={periodTrendAnalysis.journalCravingResults.map((item) => item.label)}
            series={[
              {
                label: '참아낸 횟수',
                color: '#168A4A',
                values: periodTrendAnalysis.journalCravingResults.map((item) => item.resistedCount),
              },
              {
                label: '참아내지 못한 횟수',
                color: colors.primaryDark,
                values: periodTrendAnalysis.journalCravingResults.map((item) => item.failedCount),
              },
            ]}
          />
        </View>
      ) : summary.totalRecords === 0 ? (
        <EmptyAnalysisState onOpenChecklist={onOpenChecklist} />
      ) : (
        <View style={styles.cardList}>
          <AnalysisCard
            title="흡연 충동이 많은 시간대"
            value={summary.mostFrequentTimeBucket ?? insufficientRecordText}
            description="이 시간대에는 미리 물 마시기나 짧은 산책을 준비해보세요."
          />
          <AnalysisCard
            title="자주 나타난 HALT 신호"
            value={haltValue}
            description={
              summary.mostFrequentHaltSignal
                ? haltCardDescriptions[summary.mostFrequentHaltSignal]
                : '체크된 HALT 항목이 쌓이면 주요 신호를 보여드릴게요.'
            }
          />
          <AnalysisCard
            title="평균 흡연 충동 점수"
            value={summary.averageUrgeScore === null ? insufficientRecordText : `${summary.averageUrgeScore.toFixed(1)}점`}
            description="점수가 높을수록 강한 충동을 자주 경험했다는 뜻이에요."
          />
          <AnalysisCard
            title="자주 추천된 대처 방법"
            value={summary.mostRecommendedAction?.title ?? insufficientRecordText}
            description="체크리스트 결과에서 가장 자주 제안된 방법이에요."
          />
        </View>
      )}

      <PrimaryButton label="메인으로 돌아가기" onPress={onBack} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    paddingTop: 56,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
    lineHeight: 35,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  cardList: {
    gap: spacing.md,
  },
});
