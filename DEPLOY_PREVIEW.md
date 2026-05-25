# 피드백용 GitHub/Vercel 배포 가이드

## 1. GitHub 저장소 만들기

1. GitHub에 로그인합니다.
2. 새 저장소를 만듭니다.
3. 저장소 이름을 정합니다. 예: `smokend-preview`
4. Public 또는 Private 중 팀 상황에 맞게 선택합니다.
5. README, .gitignore, License 자동 생성 옵션은 선택하지 않습니다. 이미 로컬 프로젝트에 파일이 있습니다.

## 2. 로컬 프로젝트를 GitHub에 올리는 명령어

프로젝트 루트에서 다음 명령을 실행합니다.

```bash
git init
git add .
git commit -m "Initial preview version"
git branch -M main
git remote add origin https://github.com/사용자아이디/저장소이름.git
git push -u origin main
```

이미 Git 저장소라면 `git init`은 생략하고, 원격 저장소만 확인한 뒤 push합니다.

## 3. Vercel에 GitHub 저장소 연결하기

1. Vercel에 로그인합니다.
2. `Add New...` 또는 `New Project`를 선택합니다.
3. GitHub 저장소 목록에서 방금 올린 저장소를 선택합니다.
4. 프로젝트 설정 화면에서 아래 빌드 값을 확인합니다.
5. `Deploy`를 누릅니다.

## 4. Vercel 빌드 설정값

- Framework Preset: `Other`
- Build Command: `npx expo export --platform web`
- Output Directory: `dist`
- Install Command: `npm install`

루트의 `vercel.json`에도 같은 설정이 들어 있습니다. Vercel 화면의 값과 파일 설정이 다르면 `vercel.json`을 우선으로 맞춥니다.

## 5. 배포 후 팀원에게 공유할 URL 확인 방법

1. Vercel 배포가 끝나면 Project Dashboard에서 최신 Deployment를 엽니다.
2. `Visit` 버튼 또는 표시된 도메인을 확인합니다.
3. 예: `https://smokend-preview.vercel.app`
4. 해당 URL을 팀원에게 공유합니다.

## 6. 배포 후 앱에서 확인해야 할 체크리스트

- 첫 실행 시 흡연유형 테스트가 먼저 보이는지 확인합니다.
- 흡연유형 테스트 완료 전 메인 화면에 들어갈 수 없는지 확인합니다.
- 테스트 완료 후 금연 일수 설정 화면이 보이는지 확인합니다.
- 메인 화면 최상단의 `지금 담배 피우고 싶어요` 버튼이 보이는지 확인합니다.
- 버튼 클릭 시 30초 체크리스트 화면으로 이동하는지 확인합니다.
- 체크리스트 제출 후 흡연 유형별 대처방법 2개가 표시되는지 확인합니다.
- `간단한 게임하기` 추천에는 미니게임 바로가기 버튼이 표시되는지 확인합니다.
- 금연 캘린더에서 체크리스트와 금연일기 기록이 날짜별로 보이는지 확인합니다.
- 금단현상 알림이는 Web에서 실제 푸시가 제한될 수 있으므로 안내 UI와 팝업 동작을 확인합니다.

## 7. 주의사항

- `.env` 파일은 절대 GitHub에 올리지 않습니다.
- Expo token, API 키, 개인 정보, 테스트 계정 비밀번호를 커밋하지 않습니다.
- 필요한 환경 변수 이름만 `.env.example`에 예시로 남깁니다.
- Vercel 환경 변수에 토큰을 등록하더라도 저장소에는 토큰 값을 적지 않습니다.
