# TASK

## 1. 목표

흡연 멈춰 체크리스트의 현재 흡연 충동 점수 슬라이더를 실제 드래그로 조작할 수 있게 변경한다.

## 2. 현재 상황

- `StopSmokingChecklistScreen`의 `CravingScoreSelector`는 `sample/slider`와 유사한 track/thumb/tick UI를 표시한다.
- 현재 구현은 1~10 위치를 누르는 방식이며, 실제 손가락 드래그 제스처는 처리하지 않는다.

## 3. 현재 문제

사용자가 요구한 드래그 조작이 되지 않고, 터치 위치 선택만 가능하다.

## 4. 플랫폼 영향

- Android: 손가락으로 thumb/track 영역을 좌우 드래그해 1~10 점수를 선택한다.
- Web: 마우스 드래그 또는 터치로 1~10 점수를 선택한다.
- 공통 로직: 저장되는 `cravingScore` 값과 체크리스트 기록 구조는 유지한다.

## 5. 관련 파일

- `src/screens/StopSmokingChecklistScreen.tsx`
- `TASK.md`
- `RESULT.md`

## 6. 원인 가설

이전 구현은 `Pressable`만 사용해 점수 지점 선택을 처리했기 때문에 연속적인 drag gesture 이벤트를 받지 못했다.

## 7. 수정 요구사항

- React Native 기본 `PanResponder`로 슬라이더 드래그를 처리한다.
- 드래그 위치를 1~10 정수 점수로 변환한다.
- 트랙 밖으로 이동해도 1~10 범위로 clamp한다.
- 기존 UI 스타일과 저장 로직은 유지한다.

## 8. 금지사항

- 별도 제스처 라이브러리 추가 금지
- CSS/SCSS 추가 금지
- 기존 체크리스트 저장 구조 변경 금지
- 기존 기능 삭제 금지

## 9. 검증 방법

- `npm.cmd run typecheck`
- `npm.cmd run export:web`

## 10. 작업 결과 기록 방식

작업 후 `RESULT.md`에 변경 파일, 주요 변경 내용, Android/Web 영향, 검증 결과를 기록한다.
