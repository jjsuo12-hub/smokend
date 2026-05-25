# RESULT

## 1. 작업 요약

홈 화면의 세 가지 일반 카드 버튼(금연 캘린더, 금단현상 알리미, 나의 금연 분석)의 회색 점선 border를 조정했다.

## 2. 변경 파일

- `src/screens/HomeScreen.tsx`: 카드 border를 React Native 기본 dashed border에서 `react-native-svg` 점선 Rect로 변경
- `TASK.md`: 작업 목표와 범위 기록
- `RESULT.md`: 작업 결과 기록

## 3. 주요 변경 내용

- border 두께: 기존 `3` 기준 약 1.2배인 `3.6` 적용
- dash 길이: 기존 기준값 `10` 대비 약 1.05배인 `10.5` 적용
- dash gap: `6` 유지
- 세 카드 모두 동일한 SVG dashed border를 사용하도록 처리

## 4. 플랫폼별 영향

- Android: 기존 의존성 `react-native-svg`로 점선 border를 렌더링한다.
- Web: Expo Web에서도 SVG 점선 border가 렌더링된다.

## 5. 검증 결과

- `npm.cmd run typecheck`: 통과
- `npm.cmd run export:web`: 통과
- Web export 중 기존 `expo-notifications` Web listener 경고가 출력되었지만 export는 성공했다.

## 6. 남은 이슈

- 실제 기기별 SVG dash 렌더링은 플랫폼 안티앨리어싱 차이로 약간 다르게 보일 수 있다.
