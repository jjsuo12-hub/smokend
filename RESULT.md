# RESULT

## 1. 작업 요약

나의 금연 분석의 “최근 30일” 항목을 최근 7일 항목과 같은 방식의 기간 비교/라인 그래프 화면으로 변경했다.

## 2. 변경 파일

- `src/features/patternAnalysis/types.ts`
- `src/features/patternAnalysis/patternAnalysisUtils.ts`
- `src/features/patternAnalysis/usePatternAnalysis.ts`
- `src/features/patternAnalysis/components/SevenDayComparisonCard.tsx`
- `src/features/patternAnalysis/components/LineChartCard.tsx`
- `src/screens/PatternAnalysisScreen.tsx`
- `TASK.md`
- `RESULT.md`

## 3. 주요 변경 내용

- 7일 전용 분석 로직을 기간 기반 분석 로직으로 일반화했다.
- 최근 7일과 최근 30일 모두 직전 동일 기간과 현재 기간을 비교한다.
- 최근 30일 탭에서 다음 지표를 비교한다.
  - 체크리스트 사용 횟수
  - 평균 흡연 충동 점수
  - 흡연욕구를 참아낸 횟수
  - 흡연욕구를 참아내지 못한 횟수
- 최근 30일 체크리스트 사용 횟수를 라인 그래프로 표시한다.
- 최근 30일 금연일기의 참아낸 횟수와 참아내지 못한 횟수를 같은 라인 그래프에 표시한다.
- 30일 그래프는 라벨이 겹치지 않도록 일부 날짜 라벨만 표시한다.

## 4. 플랫폼별 영향

- Android: 최근 30일 탭에서 기간 비교와 그래프가 표시된다.
- Web: 동일하게 표시된다.

## 5. 검증 결과

- `npm.cmd run typecheck`: 통과
- `npm.cmd run export:web`: 통과

## 6. 남은 이슈

- 없음
