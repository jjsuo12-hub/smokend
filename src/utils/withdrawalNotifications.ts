import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { longTermWithdrawalMessages, withdrawalMessages } from '@/data/withdrawalInfo';

export const STORAGE_KEY_WITHDRAWAL_NOTIFICATION_IDS = 'smokend.withdrawalNotificationIds';

const withdrawalNotificationChannelId = 'withdrawal-daily-reminder';
const withdrawalNotificationHour = 7;
const withdrawalNotificationMinute = 30;
const notificationScheduleDays = 60;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function calculateQuitDay(startDate: string): number {
  const start = startOfLocalDay(parseDateKey(startDate));
  const today = startOfLocalDay(new Date());
  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export function getWithdrawalMessage(day: number): string {
  if (day >= 0 && day <= 30) {
    return withdrawalMessages[day];
  }

  return longTermWithdrawalMessages[Math.floor(Math.random() * longTermWithdrawalMessages.length)];
}

export async function scheduleDailyWithdrawalNotification(startDate: string): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('[withdrawalNotifications] Web 환경에서는 금단증상 푸시 알림 예약을 건너뜁니다.');
    return;
  }

  try {
    await cancelWithdrawalNotifications();

    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      console.log('[withdrawalNotifications] 알림 권한이 없어 금단증상 알림을 예약하지 않았습니다.');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(withdrawalNotificationChannelId, {
        name: '금단증상 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const ids: string[] = [];
    const quitDayToday = calculateQuitDay(startDate);
    const firstScheduleOffset = getFirstScheduleOffset();

    for (let index = 0; index < notificationScheduleDays; index += 1) {
      const dayOffset = firstScheduleOffset + index;
      const triggerDate = getMorningTriggerDate(dayOffset);
      const notificationDay = quitDayToday + dayOffset;
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '오늘의 금단증상 안내',
          body: getWithdrawalMessage(notificationDay),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: Platform.OS === 'android' ? withdrawalNotificationChannelId : undefined,
        },
      });
      ids.push(identifier);
    }

    await AsyncStorage.setItem(STORAGE_KEY_WITHDRAWAL_NOTIFICATION_IDS, JSON.stringify(ids));
  } catch (error) {
    console.warn('[withdrawalNotifications] 금단증상 알림 예약에 실패했습니다.', error);
  }
}

export async function cancelWithdrawalNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('[withdrawalNotifications] Web 환경에서는 취소할 금단증상 푸시 알림이 없습니다.');
    return;
  }

  try {
    const ids = await getStoredNotificationIds();
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
    await AsyncStorage.removeItem(STORAGE_KEY_WITHDRAWAL_NOTIFICATION_IDS);
  } catch (error) {
    console.warn('[withdrawalNotifications] 금단증상 알림 취소에 실패했습니다.', error);
  }
}

async function getStoredNotificationIds(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY_WITHDRAWAL_NOTIFICATION_IDS);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function getFirstScheduleOffset() {
  const todayReminder = getMorningTriggerDate(0);
  return todayReminder.getTime() <= Date.now() ? 1 : 0;
}

function getMorningTriggerDate(offset: number) {
  const date = startOfLocalDay(new Date());
  date.setDate(date.getDate() + offset);
  date.setHours(withdrawalNotificationHour, withdrawalNotificationMinute, 0, 0);
  return date;
}

function parseDateKey(dateKey: string) {
  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
