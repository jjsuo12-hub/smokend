# AGENTS.md

## 프로젝트 전제

이 프로젝트는 Expo 기반 React Native 애플리케이션이다.

- Expo, React Native, TypeScript, Expo Router를 사용한다.
- Android와 Web만 지원한다.
- iOS는 지원 대상이 아니다.
- Vite는 사용하지 않는다.
- Expo CLI와 Metro 번들러를 사용한다.
- DB와 백엔드는 사용하지 않는다.
- 서버 API가 있다고 가정하지 않는다.
- 스타일은 React Native `StyleSheet.create()` 기반으로 작성한다.
- SCSS/CSS 파일을 기본 스타일 방식으로 사용하지 않는다.

## 문서 운영 방식

사용자는 프로젝트 루트에 이 `AGENTS.md`만 미리 둔다.

Codex는 작업 중 필요에 따라 아래 파일을 생성하거나 갱신한다.

- `TASK.md`: 작업 전 목표, 요구사항, 수정 범위, 검증 방법 정리
- `RESULT.md`: 작업 후 변경 파일, 변경 이유, 검증 결과 정리

`TASK.md`, `RESULT.md`는 빈 파일로 미리 만들 필요 없다.

## 기본 작업 흐름

Codex는 사용자의 요청을 받으면 다음 순서로 진행한다.

1. 요청을 분석한다.
2. 관련 파일과 현재 구조를 확인한다.
3. Android/Web 영향 여부를 확인한다.
4. 먼저 `TASK.md`를 작성한다.
5. 사용자가 명시적으로 진행을 요청하기 전까지 소스 코드를 수정하지 않는다.
6. 사용자가 `진행`, `수정`, `구현`, `바로 작업` 등을 요청하면 `TASK.md` 기준으로 작업한다.
7. 작업 후 `RESULT.md`에 결과를 정리한다.

사용자가 처음부터 “TASK.md 작성 후 바로 진행”이라고 요청한 경우에는 `TASK.md` 작성 후 바로 작업할 수 있다.

## TASK.md 작성 형식

`TASK.md`는 다음 항목을 포함한다.

```markdown
# TASK

## 1. 목표

## 2. 현재 상황

## 3. 현재 문제

## 4. 플랫폼 영향

- Android:
- Web:
- 공통 로직:

## 5. 관련 파일

## 6. 원인 가설

## 7. 수정 요구사항

## 8. 금지사항

## 9. 검증 방법

## 10. 작업 결과 기록 방식
```

## RESULT.md 작성 형식

`RESULT.md`는 다음 항목을 포함한다.

```markdown
# RESULT

## 1. 작업 요약

## 2. 변경 파일

## 3. 주요 변경 내용

## 4. 플랫폼별 영향

- Android:
- Web:

## 5. 검증 결과

## 6. 남은 이슈
```

## 권장 프로젝트 구조

기존 구조가 있다면 기존 구조를 우선한다. 새로 정리할 때는 다음 구조를 권장한다.

```text
project-root/
├─ AGENTS.md
├─ TASK.md
├─ RESULT.md
├─ app/
│  ├─ _layout.tsx
│  └─ index.tsx
├─ src/
│  ├─ features/
│  ├─ shared/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ storage/
│  │  ├─ styles/
│  │  ├─ types/
│  │  └─ utils/
│  └─ stores/
├─ assets/
├─ app.json
├─ package.json
└─ tsconfig.json
```

## Expo Router 규칙

- 화면 라우팅은 `app/` 디렉터리를 기준으로 한다.
- 공통 레이아웃은 `app/_layout.tsx`에 둔다.
- 탭 라우팅은 필요한 경우 `app/(tabs)/`를 사용한다.
- 화면 파일에 과도한 비즈니스 로직을 넣지 않는다.
- 복잡한 로직은 `src/features/` 또는 custom hook으로 분리한다.
- Web에서도 URL 접근이 자연스러운지 고려한다.

## Android/Web 지원 규칙

- Android와 Web 공통 동작을 우선한다.
- 플랫폼 차이가 필요한 경우 `Platform.OS` 분기를 최소화한다.
- 꼭 필요한 경우에만 `*.android.tsx`, `*.web.tsx` 파일을 사용한다.
- Android 동작을 깨면서 Web만 맞추지 않는다.
- Web에서만 필요한 DOM API는 공통 로직에 직접 넣지 않고 격리한다.
- `window`, `document`, `localStorage`를 공통 로직에서 직접 사용하지 않는다.

## iOS 제외 규칙

- iOS 전용 설정을 추가하지 않는다.
- iOS 빌드나 검증을 전제로 작업하지 않는다.
- `npm run ios`를 실행하지 않는다.
- iOS 전용 패키지를 추가하지 않는다.
- Expo 기본 템플릿에 이미 포함된 iOS 관련 파일은 사용자가 요청하지 않는 한 삭제하지 않는다.

## TypeScript 규칙

- 신규 코드는 TypeScript로 작성한다.
- 화면과 컴포넌트는 `.tsx`, 유틸은 `.ts`를 사용한다.
- `any` 사용은 피한다.
- props 타입은 명시한다.
- 복잡한 타입은 별도 `types.ts`로 분리한다.
- 사용하지 않는 import, 변수, 타입은 남기지 않는다.

## 컴포넌트 규칙

- 함수형 컴포넌트를 사용한다.
- 화면 컴포넌트와 재사용 컴포넌트를 분리한다.
- 공통 컴포넌트는 `src/shared/components/`에 둔다.
- 기능 전용 컴포넌트는 `src/features/{featureName}/components/`에 둔다.
- `_layout.tsx`와 `app/index.tsx`에 기능 로직을 과도하게 넣지 않는다.

## 스타일 규칙

- 스타일은 React Native `StyleSheet.create()` 기반으로 작성한다.
- 공통 색상, 간격, 폰트 크기, radius 등은 `src/shared/styles/`에 분리한다.
- 반복되는 스타일 값은 토큰으로 관리한다.
- 반응형 처리는 `useWindowDimensions()` 또는 공통 hook으로 처리한다.
- `.scss` 파일을 추가하지 않는다.
- `.css` 파일을 Android/Web 공통 기본 스타일 방식으로 추가하지 않는다.
- `className`, DOM selector, 웹 전용 CSS 전제를 사용하지 않는다.

권장 공통 스타일 구조:

```text
src/shared/styles/
├─ colors.ts
├─ spacing.ts
├─ typography.ts
├─ radius.ts
├─ shadows.ts
├─ breakpoints.ts
└─ index.ts
```

## 상태 관리 규칙

- 컴포넌트 내부 상태는 `useState`를 사용한다.
- 기능 단위 공유 상태는 custom hook 또는 Context를 사용한다.
- 앱 전역 상태는 Context 또는 Zustand를 사용한다.
- Zustand가 설치되어 있지 않다면 추가 필요성을 `TASK.md`에 먼저 적는다.
- 앱 재실행 후 유지할 값은 AsyncStorage 사용을 검토한다.
- 저장소 접근은 `src/shared/storage/`로 분리한다.
- DB, Firebase, Supabase, SQLite, Realm 등은 추가하지 않는다.

권장 저장소 구조:

```text
src/shared/storage/
├─ appStorage.ts
├─ storageKeys.ts
└─ storageTypes.ts
```

## 의존성 추가 규칙

새 패키지는 꼭 필요한 경우에만 추가한다. 추가 전 `TASK.md`에 다음을 적는다.

- 필요한 이유
- 대체 가능한 기존 방식
- 패키지명
- Android/Web 영향
- 설치 명령
- Expo 호환성 확인 방법

금지 예시:

- Vite 관련 패키지
- SCSS 관련 패키지
- DB 라이브러리
- 백엔드 SDK
- iOS 전용 패키지
- 불필요한 UI 프레임워크

## 검증 규칙

작업 후 가능한 검증 명령을 실행한다. 먼저 `package.json`의 scripts를 확인한다.

가능한 검증 예시:

```bash
npm run lint
npm run typecheck
npm test
npx expo-doctor
npx expo start
npx expo start --web
npm run android
```

검증하지 못한 명령은 `RESULT.md`에 이유를 적는다. iOS 검증은 수행하지 않는다.

## 금지사항

Codex는 다음을 하지 않는다.

- Vite 설정 추가
- React 웹앱으로 변환
- Expo 구조를 React Native CLI 구조로 임의 변경
- iOS 전용 설정 추가
- DB 또는 백엔드 추가
- Firebase, Supabase 등 외부 서비스 임의 추가
- 공통 로직에서 `localStorage`, `window`, `document` 직접 사용
- `.scss` 파일 추가
- Android/Web 공통 기본 스타일 방식으로 `.css` 파일 추가
- 관련 없는 대규모 리팩토링
- 비밀키, 토큰, 비밀번호 출력 또는 저장
- 사용자의 확인 없는 삭제성 변경

## 사용자 요청 예시

처음 요청:

```text
내 요청을 바탕으로 TASK.md를 먼저 작성해라.
아직 소스 코드는 수정하지 마라.
```

검토 후 진행:

```text
TASK.md 기준으로 작업을 진행하고, 완료 후 RESULT.md에 정리해라.
```

한 번에 진행:

```text
내 요청을 바탕으로 TASK.md를 먼저 작성한 뒤 바로 작업해라.
작업 완료 후 RESULT.md에 변경 파일, 변경 이유, Android/Web 영향, 검증 결과를 정리해라.
```
