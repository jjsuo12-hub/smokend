# RESULT

## 1. 생성/수정한 파일 목록

- `.gitignore`: GitHub 업로드 제외 항목 보강
- `.env.example`: 토큰 없는 환경 변수 예시 추가
- `package.json`, `package-lock.json`: `export:web` 스크립트 추가, Web export에 필요한 `expo-asset` 추가
- `app.json`: `expo.web.output: "static"` 추가, `expo-asset` 플러그인 반영
- `vercel.json`: Vercel Web preview 배포 설정 추가
- `DEPLOY_PREVIEW.md`: GitHub 업로드와 Vercel 연결 가이드 작성
- `TEAM_FEEDBACK_GUIDE.md`: 팀원 피드백용 안내문 작성
- `README.md`: 프로젝트 소개, 실행, 배포, 피드백 항목 작성
- `TASK.md`: 배포 준비 작업 범위 기록
- `RESULT.md`: 작업 결과 정리

## 2. GitHub 업로드 전 보안 점검 결과

루트에서 `.env*` 파일을 확인한 결과 실제 환경 변수 파일은 없고 `.env.example`만 존재한다. `.gitignore`에 민감 파일과 로컬 산출물 제외 규칙을 추가했다.

## 3. .env 제외 여부

다음 항목을 제외하도록 설정했다.

- `.env`
- `.env.*`
- `!.env.example`
- `node_modules/`
- `.expo/`
- `dist/`
- `web-build/`
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- `.DS_Store`
- `.vscode/`, `.idea/`
- `.expo-web*.log`

## 4. 추가한 package.json scripts

- `export:web`: `expo export --platform web`

기존 `start`, `android`, `web`, `typecheck` 스크립트는 유지했다.

## 5. 추가한 vercel.json 설정

- Build Command: `npx expo export --platform web`
- Output Directory: `dist`
- Dev Command: `npx expo start --web`
- Framework: `null`
- SPA 새로고침 404 방지를 위한 `/:path*` to `/` rewrite 추가

## 6. 로컬에서 실행한 검증 명령과 결과

- `npm.cmd install`: 통과
- `npm.cmd run typecheck`: 통과
- `npm.cmd run export:web`: 최초 1회 `expo-asset` 누락으로 실패 후 `npx.cmd expo install expo-asset` 적용, 재실행 통과
- `npx.cmd expo-doctor`: 18/18 통과
- `npx.cmd expo start --web --port 8082`: 백그라운드 실행 후 `http://localhost:8082` 200 응답 확인

## 7. Web 배포 시 예상되는 제한점

- `expo-notifications`는 Web에서 실제 푸시 알림 기능이 제한될 수 있다.
- Web export 중 `expo-notifications`의 push token listener 관련 경고가 표시됐지만 export는 성공했다.
- 금단현상 알림은 Web에서 실제 예약 푸시 대신 앱 내부 안내 UI와 팝업을 유지한다.
- AsyncStorage Web 저장값은 브라우저 저장소 정책, 시크릿 모드, 캐시 삭제의 영향을 받을 수 있다.

## 8. 팀원에게 공유할 때 사용할 문구

이 앱은 금연일기 앱의 임시 피드백 버전입니다. 첫 실행 시 흡연유형 테스트를 완료해야 메인 화면으로 진입할 수 있습니다. 메인 화면의 `지금 담배 피우고 싶어요` 버튼으로 30초 체크리스트를 테스트하고, 추천 대처방법과 금연 캘린더 기록 저장 흐름을 확인해 주세요. Web에서는 금단현상 실제 푸시 알림이 제한될 수 있으니 안내 UI 중심으로 확인해 주세요.

## 9. 남은 이슈

- 현재 폴더는 아직 Git 저장소가 아니므로 `git init` 후 업로드해야 한다.
- Vercel 실제 배포는 GitHub 저장소 연결 후 Vercel 대시보드에서 확인해야 한다.
- `npm install` 결과 중간 수준 audit 경고 13건이 표시되었지만 `expo-doctor`는 통과했다.
- Android 실제 실행은 이번 작업 범위에서 수행하지 않았다.
