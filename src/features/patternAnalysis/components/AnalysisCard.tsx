import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/shared/styles';

type AnalysisCardProps = {
  title: string;
  value: string;
  description: string;
};

export function AnalysisCard({ title, value, description }: AnalysisCardProps) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.description}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  value: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 33,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.xs,
  },
});
