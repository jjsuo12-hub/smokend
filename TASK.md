# TASK

## 1. 목표

현재 Expo React Native 금연일기 앱을 팀원 피드백용으로 GitHub에 올리고, Vercel 임시 Web 배포가 가능하도록 설정과 문서를 준비한다.

## 2. 현재 상황

프로젝트는 Expo Router 기반이며 Android/Web을 지원한다. 루트에 `.gitignore`는 있으나 민감 파일 제외 항목이 부족하고, `package.json`에는 `export:web` 스크립트가 없다. `app.json`은 Web bundler가 Metro로 설정되어 있으나 Web export 출력 형식은 명시되어 있지 않다.

## 3. 현재 문제

- GitHub 업로드 전 `.env`, 로컬 IDE 설정, 로그 파일 제외 항목 보강이 필요하다.
- Vercel이 Expo Web export 결과물을 배포할 수 있도록 `vercel.json`이 필요하다.
- 팀원이 배포와 피드백 방법을 따라 할 문서가 없다.
- Web export 검증이 아직 수행되지 않았다.

## 4. 플랫폼 영향

- Android: 앱 기능과 Android 실행 흐름은 변경하지 않는다.
- Web: Expo Web export와 Vercel 배포에 필요한 설정만 추가한다.
- 공통 로직: 흡연유형 테스트 최초 실행, 긴급 버튼, 체크리스트, 캘린더, 금단현상 기능 로직은 변경하지 않는다.

## 5. 관련 파일

- `.gitignore`
- `.env.example`
- `package.json`
- `app.json`
- `vercel.json`
- `DEPLOY_PREVIEW.md`
- `TEAM_FEEDBACK_GUIDE.md`
- `README.md`
- `RESULT.md`

## 6. 원인 가설

현재 앱은 로컬 개발 중심으로 구성되어 있어 GitHub/Vercel Preview 배포에 필요한 보안 제외 규칙, export 스크립트, 배포 안내 문서가 아직 준비되지 않았다.

## 7. 수정 요구사항

- `.gitignore`에 `.env`, `.env.*`, `node_modules/`, `.expo/`, `dist/`, `web-build/`, 로그, IDE 설정을 제외하도록 추가한다.
- 실제 토큰이 없는 `.env.example`을 생성한다.
- `package.json`에 `export:web` 스크립트를 추가한다.
- `app.json`에 Expo Web export용 설정을 명시한다.
- Vercel 배포용 `vercel.json`을 추가한다.
- GitHub/Vercel 업로드 안내 문서 `DEPLOY_PREVIEW.md`를 작성한다.
- 팀원 피드백용 안내 문서 `TEAM_FEEDBACK_GUIDE.md`를 작성한다.
- `README.md`에 프로젝트 소개, 실행, 배포, 피드백 항목을 정리한다.
- `npm install`, `npm run typecheck`, `npm run export:web`, `npx expo start --web` 검증 결과를 기록한다.

## 8. 금지사항

- 기존 앱 기능을 변경하지 않는다.
- 흡연유형 테스트 최초 실행 흐름을 제거하지 않는다.
- 체크리스트 저장 로직과 추천 로직을 변경하지 않는다.
- `.env`, Expo 접근 토큰, 개인 정보, API 키를 저장하거나 문서에 적지 않는다.
- iOS 전용 설정을 추가하지 않는다.

## 9. 검증 방법

- `npm install`
- `npm run typecheck`
- `npm run export:web`
- `npx expo start --web` 또는 실행 중인 Web 서버 응답 확인

## 10. 작업 결과 기록 방식

작업 완료 후 `RESULT.md`에 생성/수정 파일, 보안 점검 결과, `.env` 제외 여부, scripts, Vercel 설정, 검증 결과, Web 제한점, 팀원 공유 문구, 남은 이슈를 기록한다.
