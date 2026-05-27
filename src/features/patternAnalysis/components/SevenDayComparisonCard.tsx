import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/shared/styles';
import { SevenDayComparisonMetric } from '../types';

type SevenDayComparisonCardProps = {
  metrics: SevenDayComparisonMetric[];
};

export function SevenDayComparisonCard({ metrics }: SevenDayComparisonCardProps) {
  return (
    <Card>
      <Text style={styles.title}>7일 전과 현재 비교</Text>
      <Text style={styles.description}>직전 7일과 최근 7일의 흡연 관련 지표를 비교해요.</Text>
      <View style={styles.metricList}>
        {metrics.map((metric) => {
          const delta = metric.currentValue - metric.previousValue;
          return (
            <View key={metric.label} style={styles.metricRow}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricValues}>
                <Text style={styles.metricValue}>7일 전 {formatMetricValue(metric.previousValue, metric.unit)}</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.metricValue}>현재 {formatMetricValue(metric.currentValue, metric.unit)}</Text>
                <Text style={[styles.delta, delta > 0 && styles.deltaUp, delta < 0 && styles.deltaDown]}>
                  {delta === 0 ? '변화 없음' : `${delta > 0 ? '+' : ''}${formatMetricValue(delta, metric.unit)}`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function formatMetricValue(value: number, unit: string) {
  const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(1);
  return `${formatted}${unit}`;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.xs,
  },
  metricList: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  metricRow: {
    borderColor: colors.borderMuted,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  metricLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  metricValues: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricValue: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  arrow: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '900',
  },
  delta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  deltaUp: {
    color: colors.primaryDark,
  },
  deltaDown: {
    color: '#168A4A',
  },
});
