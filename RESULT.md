# RESULT

## 1. 실제 오류

`adb logcat`에서 확인된 Android native crash:

```text
FATAL EXCEPTION: pool-4-thread-1
Process: com.smokend.app
java.lang.NoSuchMethodError:
No static method getDirectConverter(Ljava/lang/Class;)Lexpo/modules/kotlin/types/JSTypeConverter;
in class Lexpo/modules/kotlin/types/ReturnTypeKt

expo.modules.font.FontLoaderModule.definition(FontLoaderModule.kt:98)
```

이 오류는 JavaScript 실행 전 native 단계에서 발생하므로 ErrorBoundary, router, AsyncStorage 수정으로 해결되는 문제가 아니다.

## 2. 원인

`expo-font`가 기대하는 `expo-modules-core` Kotlin API와 APK에 포함된 `expo-modules-core` 버전이 맞지 않는 native 모듈 버전 충돌로 판단했다.

## 3. 수정한 package.json 변경사항

- `expo-font`: Expo SDK 53 호환 버전 `~13.3.2` 직접 추가
- `@expo/vector-icons`: Expo SDK 53 호환 버전 `^14.1.0` 추가
- `expo-router`: Expo CLI 권장 호환 버전 `~5.1.11`로 정렬
- `expo-modules-core`: 직접 의존성으로 설치하면 안 된다는 `expo-doctor` 결과에 따라 제거
- 현재 설치 트리:
  - `expo@53.0.27`
  - `expo-font@13.3.2`
  - `expo-modules-core@2.5.0` transitive dependency from `expo`
  - `expo-router@5.1.11`
  - `expo-notifications@0.31.5`
  - `react-native@0.79.6`
  - `react@19.0.0`
  - `@expo/vector-icons@14.1.0`
  - `@react-native-async-storage/async-storage@2.1.2`

## 4. 실행한 명령어

```text
npx expo install expo-font expo-modules-core expo-router expo-notifications @expo/vector-icons @react-native-async-storage/async-storage
npm uninstall expo-modules-core
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm ls expo expo-font expo-modules-core expo-router expo-notifications react-native react @expo/vector-icons @react-native-async-storage/async-storage --depth=0
npx expo-doctor
npm run typecheck
npx expo start -c --offline
npm run export:web
npx expo export --platform android
npx eas-cli build -p android --profile preview --clear-cache --non-interactive
adb uninstall com.smokend.app
```

## 5. expo-doctor 결과

- 첫 실행: 17/18 통과
- 실패 항목: `expo-modules-core`를 직접 설치하면 안 된다는 경고
- 조치: `npm uninstall expo-modules-core`
- 클린 설치 후 재실행: 18/18 통과

## 6. Web export 결과

- `npm run export:web`: 통과
- Web 빌드 중 `expo-notifications`의 Web push token listener 미지원 경고가 있었으나 export는 성공했다.

## 7. 새 APK 빌드 여부

EAS preview APK를 `--clear-cache`로 재빌드했다.

APK 다운로드:

```text
https://expo.dev/artifacts/eas/nupBNVizEa9TYkzRscCYxM.apk
```

빌드 로그:

```text
https://expo.dev/accounts/spidey38/projects/smokend/builds/ae074aca-ccdf-4932-86be-19b94c66e263
```

## 8. Android 재설치 후 실행 결과

- `adb uninstall com.smokend.app` 실행 시도
- 결과: 로컬 PC에 `adb`가 설치되어 있지 않아 실행 불가
- 휴대폰에서 기존 `Smokend` 앱을 직접 삭제한 뒤 새 APK를 설치해야 한다.
