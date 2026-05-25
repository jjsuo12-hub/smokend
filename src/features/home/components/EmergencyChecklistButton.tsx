import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, spacing, typography } from '@/shared/styles';

type EmergencyChecklistButtonProps = {
  onPress: () => void;
};

const stopSmokingIcon = require('../../../../assets/icons/stopsmoking.png') as ImageSourcePropType;

export function EmergencyChecklistButton({ onPress }: EmergencyChecklistButtonProps) {
  const { width } = useWindowDimensions();
  const layout = getEmergencyLayout(width);

  return (
    <Pressable
      accessibilityLabel="지금 담배 피우고 싶어요. 30초 체크리스트 시작"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, { gap: layout.gap }, pressed && styles.pressed]}
    >
      <View style={[styles.iconCircle, { height: layout.circleSize, width: layout.circleSize }]}>
        <Image source={stopSmokingIcon} resizeMode="contain" style={{ height: layout.iconSize, width: layout.iconSize }} />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.title}>지금 담배 피우고 싶어요</Text>
        <Text style={styles.subtitle}>30초만 멈추고 체크하기</Text>
      </View>
    </Pressable>
  );
}

function getEmergencyLayout(width: number) {
  const circleSize = clamp(Math.round(width * 0.42), 136, 190);
  return {
    circleSize,
    iconSize: Math.round(circleSize * 0.76),
    gap: width < 380 ? spacing.md : spacing.lg,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    width: '100%',
  },
  pressed: {
    opacity: 0.84,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
  },
  textBox: {
    alignItems: 'center',
    gap: spacing.xs,
    width: '100%',
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 31,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888888',
    fontSize: typography.subheading,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
  },
});
