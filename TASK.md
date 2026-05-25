# TASK

## 1. 목표

민감 정보가 Git 커밋에 포함되지 않는지 확인한 뒤 현재 작업 내용을 GitHub 원격 저장소에 push한다.

## 2. 현재 상황

- 현재 브랜치는 `main`이다.
- 원격 저장소 `origin`은 GitHub 저장소로 설정되어 있다.
- `.gitignore`에는 `.env`, `.env.*`, `.expo`, `dist`, `node_modules`, 로그 파일, IDE 설정이 포함되어 있다.
- 현재 작업 트리에는 홈 UI, 패턴 분석 기능, 아이콘 설정, 문서 변경이 남아 있다.

## 3. 현재 문제

GitHub push 전에 실제 토큰, 비밀번호, API 키, 빌드 산출물, 로컬 로그가 커밋 대상에 포함되지 않는지 확인해야 한다.

## 4. 플랫폼 영향

- Android: 코드 변경 사항이 원격 저장소에 반영된다.
- Web: 코드 변경 사항과 Web export 설정이 원격 저장소에 반영된다.
- 공통 로직: push 작업 자체는 앱 런타임 로직을 변경하지 않는다.

## 5. 관련 파일

- `.gitignore`
- `.env.example`
- `TASK.md`
- `RESULT.md`
- 현재 변경된 앱 소스와 자산 파일

## 6. 원인 가설

Expo Web 실행 중 생성된 로그와 `dist`, `.expo`, `node_modules`가 로컬에 남아 있으나 `.gitignore`에 의해 제외되어야 한다. 실제 `.env`는 추적 대상이 아니어야 한다.

## 7. 수정 요구사항

- 민감 정보 패턴을 검색한다.
- ignored 파일이 커밋 대상에 포함되지 않는지 확인한다.
- 필요한 변경 파일만 stage한다.
- 커밋을 생성한다.
- `origin main`으로 push한다.
- push 결과를 `RESULT.md`에 기록한다.

## 8. 금지사항

- 실제 토큰, 비밀번호, API 키 값을 출력하거나 커밋하지 않는다.
- `.env`, 로그, `dist`, `.expo`, `node_modules`를 커밋하지 않는다.
- 사용자의 확인 없는 삭제성 변경을 하지 않는다.

## 9. 검증 방법

- `git status --ignored --short`
- 민감 키워드/대표 토큰 패턴 검색
- `git ls-files`
- `git push origin main`

## 10. 작업 결과 기록 방식

작업 후 `RESULT.md`에 민감 정보 점검 결과, 커밋 해시, push 대상 브랜치, 남은 이슈를 기록한다.
