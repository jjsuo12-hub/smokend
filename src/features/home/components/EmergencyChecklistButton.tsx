import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { HomeMenuIcon } from '@/components/HomeMenuIcon';
import { colors, radius, spacing, typography } from '@/shared/styles';

type EmergencyChecklistButtonProps = {
  onPress: () => void;
};

export function EmergencyChecklistButton({ onPress }: EmergencyChecklistButtonProps) {
  const { width } = useWindowDimensions();
  const compact = width < 380;

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityLabel="지금 담배 피우고 싶어요, 30초 체크리스트 시작"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.button, compact && styles.buttonCompact, pressed && styles.buttonPressed]}
      >
        <View style={styles.content}>
          <HomeMenuIcon name="checklist" size={compact ? 44 : 56} />
          <View style={styles.textBox}>
            <Text style={[styles.title, compact && styles.titleCompact]}>지금 담배 피우고 싶어요</Text>
            <Text style={styles.subtitle}>30초만 멈추고 체크해보기</Text>
          </View>
          <Text style={styles.timer}>⏱️</Text>
        </View>
      </Pressable>
      <Text style={styles.helpText}>흡연 충동은 보통 몇 분 안에 약해질 수 있어요. 먼저 30초만 확인해보세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    minHeight: 142,
    padding: spacing.xl,
  },
  buttonCompact: {
    minHeight: 132,
    padding: spacing.lg,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  textBox: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.surface,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 32,
  },
  titleCompact: {
    fontSize: 21,
    lineHeight: 28,
  },
  subtitle: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 23,
    opacity: 0.92,
  },
  timer: {
    color: colors.surface,
    fontSize: 28,
  },
  helpText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    paddingHorizontal: spacing.xs,
  },
});
