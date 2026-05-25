import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { getWithdrawalInfoForQuitDay, withdrawalInfoCards, withdrawalTimeline } from '@/data/withdrawalInfo';
import { colors, spacing, typography } from '@/shared/styles';
import { QuitProfile } from '@/types/smoking';
import { getQuitDay } from '@/utils/date';

type WithdrawalInfoScreenProps = {
  quitProfile: QuitProfile;
  onBack: () => void;
};

export function WithdrawalInfoScreen({ quitProfile, onBack }: WithdrawalInfoScreenProps) {
  const quitDay = getQuitDay(quitProfile.quitStartDate);
  const todayInfo = getWithdrawalInfoForQuitDay(quitDay);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>금단현상 알림이</Text>
        <Text style={styles.description}>오늘 겪는 변화가 이상한 것이 아니라는 점을 기억할 수 있도록 짧은 정보를 모았습니다.</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>오늘의 금단현상 안내</Text>
        <Text style={styles.meta}>금연 {quitDay}일차 · 매일 오전 {quitProfile.reminderTime}</Text>
        <Text style={styles.infoText}>{todayInfo.title}</Text>
        <Text style={styles.description}>{todayInfo.description}</Text>
        <Text style={styles.todo}>
          Android에서는 로컬 알림 권한이 허용된 경우 매일 이 시간에 정보성 알림을 예약합니다. Web에서는 앱 실행 중 팝업으로 안내합니다.
        </Text>
      </Card>

      {withdrawalInfoCards.map((info) => (
        <Card key={info} muted>
          <Text style={styles.infoText}>{info}</Text>
        </Card>
      ))}

      <Card>
        <Text style={styles.sectionTitle}>금연 일수별 안내 흐름</Text>
        {withdrawalTimeline.map((info) => (
          <View key={info.id} style={styles.timelineItem}>
            <Text style={styles.meta}>
              {info.minDay}일차{info.maxDay !== undefined ? `-${info.maxDay}일차` : ' 이후'}
            </Text>
            <Text style={styles.description}>{info.title}</Text>
          </View>
        ))}
      </Card>

      <PrimaryButton label="메인으로 돌아가기" onPress={onBack} variant="secondary" />
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
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  meta: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  todo: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
  infoText: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '800',
    lineHeight: 27,
  },
  timelineItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
});
