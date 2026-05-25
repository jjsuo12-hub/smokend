import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, radius, spacing } from '@/shared/styles';

type HomeMenuIconName = 'checklist' | 'calendar' | 'notice';

type HomeMenuIconProps = {
  name: HomeMenuIconName;
  size?: number;
};

const stopSmokingIcon = require('../../assets/icons/stopsmoking.png') as ImageSourcePropType;

const calendarSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="50" width="140" height="120" rx="15" stroke="#333333" stroke-width="12"/>
  <path d="M30 90H170" stroke="#333333" stroke-width="12"/>
  <path d="M60 30V70M140 30V70" stroke="#E85454" stroke-width="12" stroke-linecap="round"/>
  <path d="M90 130L100 140L130 110" stroke="#E85454" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const noticeSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 30C75 30 55 50 55 75V110L40 130H160L145 110V75C145 50 125 30 100 30Z" stroke="#333333" stroke-width="12" stroke-linejoin="round"/>
  <path d="M80 150C80 161 89 170 100 170C111 170 120 161 120 150" stroke="#333333" stroke-width="12" stroke-linecap="round"/>
  <circle cx="145" cy="55" r="20" fill="#E85454"/>
  <path d="M145 45V65M135 55H155" stroke="white" stroke-width="6" stroke-linecap="round"/>
</svg>`;

export function HomeMenuIcon({ name, size = 44 }: HomeMenuIconProps) {
  return (
    <View style={[styles.frame, { height: size + spacing.md, width: size + spacing.md }]}>
      {name === 'checklist' ? (
        <Image source={stopSmokingIcon} resizeMode="contain" style={{ height: size, width: size }} />
      ) : (
        <SvgXml xml={name === 'calendar' ? calendarSvg : noticeSvg} height={size} width={size} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
