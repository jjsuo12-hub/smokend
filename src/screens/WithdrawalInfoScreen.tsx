import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const { width } = useWindowDimensions();
  const quitDay = getQuitDay(quitProfile.quitStartDate);
  const todayInfo = getWithdrawalInfoForQuitDay(quitDay);
  const maxDescriptionChars = getMaxDescriptionChars(width);

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
        <Text style={styles.description}>{wrapTextByWhitespace(todayInfo.description, maxDescriptionChars)}</Text>
        <Text style={styles.todo}>
          {wrapTextByWhitespace(
            'Android에서는 로컬 알림 권한이 허용된 경우 매일 이 시간에 정보성 알림을 예약합니다. Web에서는 앱 실행 중 팝업으로 안내합니다.',
            maxDescriptionChars,
          )}
        </Text>
      </Card>

      {withdrawalInfoCards.map((info) => (
        <Card key={info} muted>
          <Text style={styles.infoText}>{wrapTextByWhitespace(info, maxDescriptionChars)}</Text>
        </Card>
      ))}

      <Card>
        <Text style={styles.sectionTitle}>날짜별 금단증상 안내</Text>
        {withdrawalTimeline.map((info) => (
          <View key={info.id} style={styles.timelineItem}>
            <Text style={styles.meta}>
              {info.minDay}일차
            </Text>
            <Text style={styles.description}>{wrapTextByWhitespace(info.description, maxDescriptionChars)}</Text>
          </View>
        ))}
      </Card>

      <PrimaryButton label="메인으로 돌아가기" onPress={onBack} variant="secondary" />
    </ScrollView>
  );
}

function getMaxDescriptionChars(screenWidth: number) {
  const horizontalPadding = spacing.xl * 2 + spacing.lg * 2;
  const availableWidth = Math.max(screenWidth - horizontalPadding, 180);
  return Math.max(14, Math.floor(availableWidth / (typography.body * 0.78)));
}

function wrapTextByWhitespace(text: string, maxLineChars: number) {
  if (text.length <= maxLineChars) {
    return text;
  }

  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > maxLineChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
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
