import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { defaultNotificationTime } from '@/data/withdrawalInfo';
import { colors, spacing, typography } from '@/shared/styles';
import { saveQuitProfile } from '@/storage/smokingStorage';
import { QuitProfile } from '@/types/smoking';
import { getQuitDay, getQuitStartDateFromDays } from '@/utils/date';
import { scheduleWithdrawalReminder } from '@/utils/notifications';

type QuitSetupScreenProps = {
  onCompleted: (profile: QuitProfile) => void;
};

export function QuitSetupScreen({ onCompleted }: QuitSetupScreenProps) {
  const [quitDaysText, setQuitDaysText] = useState('0');
  const [saving, setSaving] = useState(false);
  const quitDays = Number(quitDaysText);
  const validDays = Number.isInteger(quitDays) && quitDays >= 0 && quitDays <= 36500;

  const saveProfile = async () => {
    if (!validDays || saving) {
      return;
    }
    setSaving(true);
    const quitStartDate = getQuitStartDateFromDays(quitDays);
    const notificationResult = await scheduleWithdrawalReminder(getQuitDay(quitStartDate), defaultNotificationTime);
    const profile: QuitProfile = {
      quitStartDate,
      initialQuitDays: quitDays,
      configuredAt: new Date().toISOString(),
      notificationEnabled: notificationResult.enabled,
      reminderTime: defaultNotificationTime,
    };
    await saveQuitProfile(profile);
    setSaving(false);
    onCompleted(profile);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>초기 설정</Text>
        <Text style={styles.title}>현재 금연 일수를 알려주세요</Text>
        <Text style={styles.description}>
          입력한 금연 일수에 맞춰 금단현상 정보를 보여드리고, 매일 오전 7:30에 정보성 알림을 준비합니다.
        </Text>
      </View>

      <Card>
        <Text style={styles.label}>현재 금연한 일수</Text>
        <TextInput
          value={quitDaysText}
          onChangeText={(text) => setQuitDaysText(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholder="예: 0"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={styles.description}>
          오늘 금연을 시작했다면 0을 입력하세요. 이 값은 금연 시작일로 변환되어 기기에 저장됩니다.
        </Text>
      </Card>

      <PrimaryButton label={saving ? '저장 중...' : '금연 일수 저장하고 시작하기'} onPress={saveProfile} disabled={!validDays || saving} />
    </ScrollView>
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
  eyebrow: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
});
