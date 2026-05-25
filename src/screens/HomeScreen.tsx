import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { HomeMenuIcon } from '@/components/HomeMenuIcon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { getWithdrawalInfoForQuitDay } from '@/data/withdrawalInfo';
import { EmergencyChecklistButton } from '@/features/home/components/EmergencyChecklistButton';
import { smokingTypeLabels } from '@/data/smokingTypeTest';
import { colors, radius, spacing, typography } from '@/shared/styles';
import { getWithdrawalPopupDate, resetSmokingTypeResult, saveWithdrawalPopupDate } from '@/storage/smokingStorage';
import { QuitProfile, SmokingTypeResult } from '@/types/smoking';
import { formatKoreanDate, getQuitDay, isAfterReminderTime, toDateKey } from '@/utils/date';

type HomeScreenProps = {
  result: SmokingTypeResult;
  quitProfile: QuitProfile;
  onOpenChecklist: () => void;
  onOpenCalendar: () => void;
  onOpenWithdrawal: () => void;
  onResetTest: () => void;
};

export function HomeScreen({ result, quitProfile, onOpenChecklist, onOpenCalendar, onOpenWithdrawal, onResetTest }: HomeScreenProps) {
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false);
  const quitDay = getQuitDay(quitProfile.quitStartDate);
  const withdrawalInfo = getWithdrawalInfoForQuitDay(quitDay);

  useEffect(() => {
    async function prepareDailyPopup() {
      const today = toDateKey(new Date());
      const lastShownDate = await getWithdrawalPopupDate();
      if (lastShownDate !== today && isAfterReminderTime(new Date(), quitProfile.reminderTime)) {
        setShowWithdrawalPopup(true);
      }
    }
    void prepareDailyPopup();
  }, [quitProfile.reminderTime]);

  const resetTest = async () => {
    await resetSmokingTypeResult();
    onResetTest();
  };

  const closeWithdrawalPopup = async () => {
    await saveWithdrawalPopupDate(toDateKey(new Date()));
    setShowWithdrawalPopup(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatKoreanDate(new Date())}</Text>
          <Text style={styles.title}>오늘도 금연을 이어가고 있어요</Text>
          <Text style={styles.type}>나의 흡연 유형: {smokingTypeLabels[result.smokingTypeResult]}</Text>
          <Text style={styles.type}>금연 {quitDay}일차 · 알림 {quitProfile.reminderTime}</Text>
        </View>

        <EmergencyChecklistButton onPress={onOpenChecklist} />

        <View style={styles.menu}>
          <Card>
            <View style={styles.menuHeader}>
              <HomeMenuIcon name="calendar" />
              <View style={styles.menuText}>
                <Text style={styles.cardTitle}>금연 캘린더</Text>
                <Text style={styles.cardText}>체크리스트와 금연일기를 날짜별로 확인합니다.</Text>
              </View>
            </View>
            <PrimaryButton label="캘린더 열기" onPress={onOpenCalendar} variant="secondary" />
          </Card>
          <Card>
            <View style={styles.menuHeader}>
              <HomeMenuIcon name="notice" />
              <View style={styles.menuText}>
                <Text style={styles.cardTitle}>금단현상 알림이</Text>
                <Text style={styles.cardText}>금연 {quitDay}일차에 맞는 금단현상 정보를 확인합니다.</Text>
              </View>
            </View>
            <PrimaryButton label="정보 보기" onPress={onOpenWithdrawal} variant="secondary" />
          </Card>
        </View>

        <PrimaryButton label="개발용: 흡연 유형 테스트 초기화" onPress={resetTest} variant="ghost" />
      </ScrollView>

      <Modal visible={showWithdrawalPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.cardTitle}>금연 {quitDay}일차 안내</Text>
            <Text style={styles.popupTitle}>{withdrawalInfo.title}</Text>
            <Text style={styles.cardText}>{withdrawalInfo.description}</Text>
            <PrimaryButton label="오늘 안내 확인" onPress={closeWithdrawalPopup} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    paddingTop: 56,
  },
  header: {
    gap: spacing.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 38,
  },
  type: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  menu: {
    gap: spacing.md,
  },
  menuHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  menuText: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  cardText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  popupTitle: {
    color: colors.primaryDark,
    fontSize: typography.subheading,
    fontWeight: '900',
    lineHeight: 27,
  },
  modalOverlay: {
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.md,
    padding: spacing.lg,
  },
});
