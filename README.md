# Smokend

Smokend는 Expo 기반 React Native 금연일기 앱입니다. Android와 Web을 대상으로 하며, 최초 실행 시 흡연유형 테스트를 완료해야 메인 기능에 접근할 수 있습니다.

## 주요 기능

- 최초 실행 흡연유형 테스트
- 금연 일수 초기 설정
- 메인 화면 최상단 긴급 버튼: `지금 담배 피우고 싶어요`
- 흡연 멈춰! 30초 체크리스트
- 흡연 유형별 흡연충동 대처방법 2개 추천
- `간단한 게임하기` 추천 시 미니게임 바로가기 제공
- 금연 캘린더와 날짜별 체크리스트 기록 확인
- 금연일기 작성과 12가지 대처방법 + 기타 기록
- 금연 일수별 금단현상 안내

## 로컬 실행 방법

```bash
npm install
npm start
```

Android 실행:

```bash
npm run android
```

## Web 미리보기 실행 방법

```bash
npm run web
```

Web export 빌드:

```bash
npm run export:web
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## Vercel 배포 방법

Vercel에서는 다음 설정을 사용합니다.

- Framework Preset: `Other`
- Build Command: `npx expo export --platform web`
- Output Directory: `dist`
- Install Command: `npm install`

루트의 `vercel.json`에 같은 설정이 포함되어 있습니다. 자세한 배포 절차는 [DEPLOY_PREVIEW.md](./DEPLOY_PREVIEW.md)를 확인하세요.

## Android/Web 차이

- Android에서는 `expo-notifications`를 사용해 로컬 알림 권한 요청과 오전 7:30 알림 예약을 시도합니다.
- Web에서는 실제 푸시 알림이 제한될 수 있어 앱 내부 안내 UI와 팝업을 사용합니다.
- 앱 데이터는 AsyncStorage 기반으로 저장됩니다. Web에서는 브라우저 저장소 정책의 영향을 받을 수 있습니다.

## 팀원 피드백 요청 항목

- 첫 실행 흡연유형 테스트 흐름이 이해하기 쉬운지
- 메인 긴급 버튼이 바로 눈에 들어오는지
- 30초 체크리스트가 빠르게 완료 가능한지
- 추천 대처방법이 상황에 맞고 실행하기 쉬운지
- 금연 캘린더와 금연일기 기록 흐름이 자연스러운지
- 금단현상 안내 문구가 부담 없이 읽히는지
- Android/Web에서 화면이 깨지지 않는지

팀원 공유용 짧은 안내문은 [TEAM_FEEDBACK_GUIDE.md](./TEAM_FEEDBACK_GUIDE.md)를 사용하세요.

## 보안 주의사항

`.env`, Expo 접근 토큰, 개인 정보, API 키는 GitHub에 올리지 않습니다. 필요한 환경 변수 이름만 `.env.example`에 예시로 남깁니다.
