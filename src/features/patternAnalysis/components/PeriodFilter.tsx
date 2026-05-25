import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/shared/styles';
import { AnalysisPeriod } from '../types';

type PeriodFilterProps = {
  value: AnalysisPeriod;
  onChange: (period: AnalysisPeriod) => void;
};

const options: { label: string; value: AnalysisPeriod }[] = [
  { label: '전체', value: 'all' },
  { label: '최근 7일', value: '7d' },
  { label: '최근 30일', value: '30d' },
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  option: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.surface,
  },
});
