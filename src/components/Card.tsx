import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/styles';

type CardProps = PropsWithChildren<{
  muted?: boolean;
}>;

export function Card({ children, muted = false }: CardProps) {
  return <View style={[styles.card, muted && styles.muted]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
});
