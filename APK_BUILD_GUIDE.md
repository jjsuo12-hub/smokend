# APK Build Guide

이 문서는 Android 휴대폰에 직접 설치할 수 있는 APK 파일을 EAS Build로 만드는 방법을 정리한다.

## 1. EAS 로그인 확인

```bash
npx eas whoami
```

## 2. EAS 로그인

로그인이 필요하면 아래 명령어를 실행한다.

```bash
npx eas login
```

## 3. APK 빌드 실행

프로젝트 루트에서 아래 명령어 중 하나를 실행한다.

```bash
npm run build:android:apk
```

또는

```bash
npx eas build -p android --profile preview
```

## 4. 빌드 완료 후 APK 받는 방법

- 터미널에 표시되는 Expo 빌드 링크에 접속한다.
- Android APK 파일을 다운로드한다.
- 휴대폰에서 APK 파일을 연다.
- 설치 시 “알 수 없는 앱 설치” 권한을 허용한다.
- 설치 후 앱을 실행한다.
- 최초 실행 시 흡연유형 테스트가 먼저 나오는지 확인한다.

## 참고

- APK 파일은 GitHub에 직접 올리지 않는다.
- 나중에 APK 다운로드 페이지가 필요하면 GitHub Release나 별도 호스팅을 사용한다.
