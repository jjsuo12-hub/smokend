import { Image, ImageSourcePropType, Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '@/shared/styles';

type EmergencyChecklistButtonProps = {
  onPress: () => void;
};

const stopSmokingIcon = require('../../../../assets/icons/stopsmoking.png') as ImageSourcePropType;
const copingShortsUrl = 'https://www.youtube.com/shorts/7igO-Kgsflk?si=GKIsvm4sDb1YfmsM';

export function EmergencyChecklistButton({ onPress }: EmergencyChecklistButtonProps) {
  const { width } = useWindowDimensions();
  const layout = getEmergencyLayout(width);

  return (
    <View style={[styles.wrapper, { gap: layout.gap }]}>
      <Pressable
        accessibilityLabel="지금 담배 피우고 싶어요. 30초 체크리스트 시작"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.mainButton, { gap: layout.gap }, pressed && styles.pressed]}
      >
        <View style={[styles.iconCircle, { height: layout.circleSize, width: layout.circleSize }]}>
          <Image source={stopSmokingIcon} resizeMode="contain" style={{ height: layout.iconSize, width: layout.iconSize }} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.title}>지금 담배 피우고 싶어요</Text>
          <Text style={styles.subtitle}>30초만 멈추고 체크하기</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel="흡연대처방법 쇼츠 보기"
        accessibilityRole="link"
        onPress={() => void Linking.openURL(copingShortsUrl)}
        style={({ pressed }) => [styles.shortsButton, pressed && styles.shortsButtonPressed]}
      >
        <View style={styles.shortsIconWrapper}>
          <ArrowIcon />
        </View>
        <Text style={styles.shortsText}>흡연대처방법 쇼츠 보기</Text>
      </Pressable>
    </View>
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
    width: '100%',
  },
  mainButton: {
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
  shortsButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing.md,
    maxWidth: 320,
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  shortsButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  shortsIconWrapper: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  shortsText: {
    color: '#ffffff',
    flexShrink: 1,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 21,
  },
});

function ArrowIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 14 15" fill="none">
      <Path
        d="M13.376 11.552L13.112 1.112L2.672 0.872L2.696 3.152L9.656 3.104L0.2 12.56L1.688 14.048L11.12 4.616L11.072 11.528L13.376 11.552Z"
        fill={colors.primary}
      />
    </Svg>
  );
}
