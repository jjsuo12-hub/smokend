import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '@/shared/styles';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function PrimaryButton({ label, onPress, disabled = false, variant = 'primary' }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && variant === 'primary' && styles.primaryPressed,
        pressed && !disabled && variant === 'secondary' && styles.secondaryPressed,
        pressed && !disabled && variant === 'ghost' && styles.ghostPressed,
      ]}
    >
      <Text style={[styles.label, variant !== 'primary' && styles.secondaryLabel, disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },
  disabled: {
    opacity: 0.45,
  },
  disabledLabel: {
    color: colors.textMuted,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  secondaryPressed: {
    backgroundColor: colors.borderMuted,
  },
  ghostPressed: {
    backgroundColor: colors.surfaceMuted,
  },
});
