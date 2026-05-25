# TASK

## 1. 목표

`adb logcat`에서 확인된 Android APK 실행 직후 native crash를 Expo SDK 호환 의존성 정렬로 해결한다.

## 2. 현재 상황

- 실제 오류:
  - `FATAL EXCEPTION: pool-4-thread-1`
  - `Process: com.smokend.app`
  - `java.lang.NoSuchMethodError`
  - `No static method getDirectConverter(Ljava/lang/Class;)Lexpo/modules/kotlin/types/JSTypeConverter;`
  - 위치: `expo.modules.font.FontLoaderModule.definition(FontLoaderModule.kt:98)`
- JavaScript 실행 전 native 모듈 단계에서 앱이 종료된다.
- 원인은 화면 로직, AsyncStorage, router 문제가 아니라 `expo-font` / `expo-modules-core` 계열 버전 충돌로 판단한다.

## 3. 현재 문제

Expo SDK 53 기준으로 Expo 관련 패키지와 native 모듈 버전이 완전히 정렬되지 않았거나, 기존 `node_modules`/lockfile에 충돌 버전이 남아 있을 수 있다.

## 4. 플랫폼 영향

- Android: native 모듈 버전 충돌을 제거해 APK 실행 직후 종료를 해결한다.
- Web: 기존 Web export/Vercel 흐름을 유지한다.
- 공통 로직: 기존 기능과 최초 실행 흡연유형 테스트 흐름은 변경하지 않는다.

## 5. 관련 파일

- `package.json`
- `package-lock.json`
- `node_modules/`
- `RESULT.md`
- `TASK.md`

## 6. 원인 가설

`expo-font`가 참조하는 `expo-modules-core` Kotlin API와 실제 APK에 포함된 `expo-modules-core` 버전이 맞지 않아 native `NoSuchMethodError`가 발생했다.

## 7. 수정 요구사항

- 현재 패키지 버전을 확인한다.
- `npx expo install expo-font expo-modules-core expo-router expo-notifications @expo/vector-icons @react-native-async-storage/async-storage`로 Expo SDK 호환 버전을 설치한다.
- `npx expo-doctor`로 의존성 정합성을 확인한다.
- `node_modules`와 `package-lock.json`을 삭제 후 `npm install`로 깨끗하게 재설치한다.
- Expo 캐시 정리 실행을 시도한다.
- `npm run export:web`을 검증한다.
- EAS preview APK를 `--clear-cache`로 재빌드한다.

## 8. 금지사항

- 기존 기능 삭제 금지
- 최초 실행 흡연유형 테스트 흐름 변경 금지
- 임의 버전 수동 지정 금지
- Git remote 변경 금지
- 비밀키 출력 금지
- iOS 검증/설정 추가 금지

## 9. 검증 방법

- `npx.cmd expo-doctor`
- `npm.cmd run typecheck`
- `npm.cmd run export:web`
- `npx.cmd expo start -c`
- `npx.cmd eas-cli build -p android --profile preview --clear-cache --non-interactive`
- 가능하면 `adb uninstall com.smokend.app`

## 10. 작업 결과 기록 방식

작업 후 `RESULT.md`에 실제 오류, 버전 충돌 원인, `package.json` 변경사항, 실행 명령어, `expo-doctor` 결과, Web export 결과, APK 빌드 결과, Android 재설치 확인 여부를 기록한다.
