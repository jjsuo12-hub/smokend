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
}
