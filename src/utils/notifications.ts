import { Platform } from 'react-native';
import { defaultNotificationTime } from '@/data/withdrawalInfo';
import { getQuitDay } from '@/utils/date';

export async function scheduleWithdrawalReminder(startDate: string, _reminderTime = defaultNotificationTime) {
  if (Platform.OS === 'web') {
    console.log('[withdrawalNotifications] Web 환경에서는 금단증상 푸시 알림 예약을 건너뜁니다.');
    return { enabled: false, reason: 'web-not-supported', quitDay: getQuitDay(startDate) };
  }

  try {
    const { scheduleDailyWithdrawalNotification } = await import('@/utils/withdrawalNotifications');
    await scheduleDailyWithdrawalNotification(startDate);
    return { enabled: true, reason: 'scheduled', quitDay: getQuitDay(startDate) };
  } catch (error) {
    console.warn('[notifications] 금단현상 알림 예약에 실패했습니다. 알림 없이 계속 진행합니다.', error);
    return { enabled: false, reason: 'error', quitDay: getQuitDay(startDate) };
  }
}
