import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { defaultNotificationTime, getWithdrawalInfoForQuitDay } from '@/data/withdrawalInfo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const androidChannelId = 'withdrawal-reminder';

export async function scheduleWithdrawalReminder(quitDay: number, reminderTime = defaultNotificationTime) {
  if (Platform.OS === 'web') {
    return { enabled: false, reason: 'web-not-supported' };
  }

  // 알림 예약은 부가 기능이다. 권한 거부나 네이티브 예외(예: Android의 정확 알람 권한 문제)가
  // 발생해도 절대 throw하지 않도록 감싸서, 메인 화면 진입이 알림 성공 여부에 묶이지 않게 한다.
  try {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      return { enabled: false, reason: 'permission-denied' };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(androidChannelId, {
        name: '금단현상 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const [hourText, minuteText] = reminderTime.split(':');
    const info = getWithdrawalInfoForQuitDay(quitDay);

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `금연 ${quitDay}일차 안내`,
        body: `${info.title} ${info.description}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: Number(hourText),
        minute: Number(minuteText),
        channelId: Platform.OS === 'android' ? androidChannelId : undefined,
      },
    });

    return { enabled: true, reason: 'scheduled' };
  } catch (error) {
    console.warn('[notifications] 금단현상 알림 예약에 실패했습니다. 알림 없이 계속 진행합니다.', error);
    return { enabled: false, reason: 'error' };
  }
}
