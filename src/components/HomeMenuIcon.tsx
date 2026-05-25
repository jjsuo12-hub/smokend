import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type HomeMenuIconName = 'calendar' | 'notice' | 'maps';

type HomeMenuIconProps = {
  name: HomeMenuIconName;
  size?: number;
};

export function HomeMenuIcon({ name, size = 48 }: HomeMenuIconProps) {
  return (
    <View style={[styles.frame, { height: size + 24, width: size + 24 }]}>
      {name === 'calendar' ? <CalendarIcon size={size} /> : null}
      {name === 'notice' ? <NoticeIcon size={size} /> : null}
      {name === 'maps' ? <MapsIcon size={size} /> : null}
    </View>
  );
}

function CalendarIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Rect x="30" y="50" width="140" height="120" rx="15" stroke="#333333" strokeWidth="12" />
      <Path d="M30 90H170" stroke="#333333" strokeWidth="12" />
      <Path d="M60 30V70M140 30V70" stroke="#A50034" strokeWidth="12" strokeLinecap="round" />
      <Path d="M90 130L100 140L130 110" stroke="#A50034" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function NoticeIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Path
        d="M100 30C75 30 55 50 55 75V110L40 130H160L145 110V75C145 50 125 30 100 30Z"
        stroke="#333333"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      <Path d="M80 150C80 161 89 170 100 170C111 170 120 161 120 150" stroke="#333333" strokeWidth="12" strokeLinecap="round" />
      <Circle cx="145" cy="55" r="20" fill="#A50034" />
      <Path d="M145 45V65M135 55H155" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </Svg>
  );
}

function MapsIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Rect x="106" y="280" width="60" height="168" rx="10" fill="#333333" />
      <Rect x="196" y="210" width="60" height="238" rx="10" fill="#333333" />
      <Rect x="286" y="250" width="60" height="198" rx="10" fill="#333333" />
      <Rect x="376" y="180" width="60" height="268" rx="10" fill="#A50034" />
      <Path d="M257 60 L285 60 L279 140 L263 140 Z" fill="#A50034" />
      <Circle cx="271" cy="171" r="16" fill="#A50034" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    backgroundColor: '#C8C8C8',
    borderRadius: 999,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
