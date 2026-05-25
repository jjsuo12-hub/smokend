import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { smokingTypeLabels, smokingTypeOrder } from '@/data/smokingTypeTest';
import { colors, spacing, typography } from '@/shared/styles';
import { SmokingTypeResult } from '@/types/smoking';

type SmokingTypeResultCardProps = {
  result: SmokingTypeResult;
};

export function SmokingTypeResultCard({ result }: SmokingTypeResultCardProps) {
  const hasTie = result.tiedTypes.length > 1;

  return (
    <Card>
      <Text style={styles.title}>당신의 주요 흡연 유형은 {smokingTypeLabels[result.smokingTypeResult]}입니다.</Text>
      {hasTie ? (
        <Text style={styles.notice}>
          복합적 특성이 있습니다: {result.tiedTypes.map((type) => smokingTypeLabels[type]).join(', ')}
        </Text>
      ) : null}
      <View style={styles.scoreList}>
        {smokingTypeOrder.map((type) => (
          <View key={type} style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{smokingTypeLabels[type]}</Text>
            <Text style={styles.scoreValue}>
              {result.smokingTypeScores[type]}점{result.strongTypes.includes(type) ? ' · 강한 경향' : ''}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '800',
    lineHeight: 26,
  },
  notice: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '700',
  },
  scoreList: {
    gap: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  scoreLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
  },
  scoreValue: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
