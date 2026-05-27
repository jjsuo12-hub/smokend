# TASK

## 1. 목표

나의 금연 분석의 “최근 30일” 항목도 최근 7일 항목과 동일한 방식으로 30일 전 대비 현재 비교와 30일 추이 라인 그래프를 제공한다.

## 2. 현재 상황

- 최근 7일 탭은 7일 전 대비 현재 비교 카드와 라인 그래프를 표시한다.
- 최근 30일 탭은 아직 기존 요약 카드 방식으로 동작한다.
- 7일 분석 타입과 함수 이름이 `SevenDay...`로 고정되어 있다.

## 3. 현재 문제

최근 30일 탭에서 사용자가 요청한 30일 전 대비 비교와 30일 체크리스트/금연일기 라인 그래프가 표시되지 않는다.

## 4. 플랫폼 영향

- Android: 최근 30일 탭에서 30일 비교와 그래프가 표시된다.
- Web: 동일한 UI가 표시된다.
- 공통 로직: 기존 기록 저장 구조는 유지한다.

## 5. 관련 파일

- `src/features/patternAnalysis/types.ts`
- `src/features/patternAnalysis/patternAnalysisUtils.ts`
- `src/features/patternAnalysis/usePatternAnalysis.ts`
- `src/features/patternAnalysis/components/SevenDayComparisonCard.tsx`
- `src/screens/PatternAnalysisScreen.tsx`
- `TASK.md`
- `RESULT.md`

## 6. 원인 가설

7일 분석 구현이 기간 숫자 7에 고정되어 있고, 화면 분기도 `period === "7d"`에만 연결되어 있다.

## 7. 수정 요구사항

- 기간별 분석 함수를 7일/30일 모두 사용할 수 있게 일반화한다.
- 최근 30일 선택 시 직전 30일과 최근 30일을 비교한다.
- 최근 30일 체크리스트 사용 횟수를 라인 그래프로 표시한다.
- 최근 30일 금연일기의 참아낸 횟수/참아내지 못한 횟수를 같은 라인 그래프에 표시한다.
- 기존 최근 7일 동작은 유지한다.

## 8. 금지사항

- 기존 기능 삭제 금지
- 서버/DB 추가 금지
- 기존 저장 구조 변경 금지
- TypeScript 오류 방치 금지

## 9. 검증 방법

- `npm.cmd run typecheck`
- `npm.cmd run export:web`

## 10. 작업 결과 기록 방식

작업 후 `RESULT.md`에 변경 파일, 변경 내용, 검증 결과를 기록한다.
