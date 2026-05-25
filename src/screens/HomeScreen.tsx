import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
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
  onOpenPatternAnalysis: () => void;
  onOpenWithdrawal: () => void;
  onResetTest: () => void;
};

type HomeIconName = 'calendar' | 'notice' | 'maps';

export function HomeScreen({
  result,
  quitProfile,
  onOpenChecklist,
  onOpenCalendar,
  onOpenPatternAnalysis,
  onOpenWithdrawal,
  onResetTest,
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false);
  const quitDay = getQuitDay(quitProfile.quitStartDate);
  const withdrawalInfo = getWithdrawalInfoForQuitDay(quitDay);
  const layout = getHomeLayout(width);

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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            gap: layout.sectionGap,
            paddingHorizontal: layout.pagePadding,
            paddingVertical: layout.verticalPadding,
          },
        ]}
      >
        <View style={[styles.content, { maxWidth: layout.contentMaxWidth }]}>
          <View style={styles.header}>
            <Text style={styles.date}>{formatKoreanDate(new Date())}</Text>
            <Text style={styles.title}>오늘도 금연을 이어가고 있어요</Text>
            <Text style={styles.type}>나의 흡연유형: {smokingTypeLabels[result.smokingTypeResult]}</Text>
            <Text style={styles.type}>금연 {quitDay}일차</Text>
          </View>

          <EmergencyChecklistButton onPress={onOpenChecklist} />

          <View style={[styles.menu, { gap: layout.cardGap }]}>
            <HomeMenuCard
              title="금연 캘린더"
              description="체크리스트와 금연일기 확인하기"
              iconName="calendar"
              iconSize={layout.cardIconSize}
              compact={layout.compactCards}
              onPress={onOpenCalendar}
            />
            <HomeMenuCard
              title="금단현상 알리미"
              description={`금연 ${quitDay}일차에 맞는\n금단현상 정보를 확인합니다`}
              iconName="notice"
              iconSize={layout.cardIconSize}
              compact={layout.compactCards}
              onPress={onOpenWithdrawal}
            />
            <HomeMenuCard
              title="나의 금연 분석"
              description="흡연충동 패턴 분석하기"
              iconName="maps"
              iconSize={layout.cardIconSize}
              compact={layout.compactCards}
              onPress={onOpenPatternAnalysis}
            />
          </View>

          <PrimaryButton label="개발용: 흡연 유형 테스트 초기화" onPress={resetTest} variant="ghost" />
        </View>
      </ScrollView>

      <Modal visible={showWithdrawalPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { maxWidth: layout.contentMaxWidth }]}>
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

function HomeMenuCard({
  title,
  description,
  iconName,
  iconSize,
  compact,
  onPress,
}: {
  title: string;
  description: string;
  iconName: HomeIconName;
  iconSize: number;
  compact: boolean;
  onPress: () => void;
}) {
  const [size, setSize] = useState({ height: 0, width: 0 });
  const borderRadius = compact ? 16 : 20;
  const borderWidth = 3.6;
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setSize({ height, width });
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onLayout={handleLayout}
      style={({ pressed }) => [styles.menuCard, compact && styles.menuCardCompact, pressed && styles.menuCardPressed]}
    >
      {size.width > 0 && size.height > 0 ? (
        <Svg height={size.height} pointerEvents="none" style={styles.dashedBorder} width={size.width}>
          <Rect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={size.width - borderWidth}
            height={size.height - borderWidth}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke="#888888"
            strokeDasharray="10.5 6"
            strokeLinecap="round"
            strokeWidth={borderWidth}
          />
        </Svg>
      ) : null}
      <View style={styles.menuText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{description}</Text>
      </View>
      <HomeMenuIcon name={iconName} size={iconSize} />
    </Pressable>
  );
}

function getHomeLayout(width: number) {
  const pagePadding = width < 360 ? spacing.lg : width < 720 ? spacing.xl : spacing.xxl;
  const availableWidth = Math.max(width - pagePadding * 2, 0);
  const contentMaxWidth = Math.min(availableWidth, width >= 900 ? 520 : 430);

  return {
    pagePadding,
    contentMaxWidth,
    verticalPadding: width < 380 ? spacing.xl : 40,
    sectionGap: width < 380 ? spacing.lg : spacing.xl,
    cardGap: width < 380 ? spacing.md : spacing.lg,
    cardIconSize: width < 360 ? 40 : width < 720 ? 48 : 56,
    compactCards: width < 360,
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    flexGrow: 1,
  },
  content: {
    gap: spacing.xl,
    width: '100%',
  },
  header: {
    gap: spacing.sm,
    width: '100%',
  },
  date: {
    color: '#000000',
    fontSize: typography.body,
  },
  title: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 34,
  },
  type: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: '800',
    lineHeight: 25,
  },
  menu: {
    width: '100%',
  },
  menuCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 108,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuCardCompact: {
    borderRadius: 16,
    minHeight: 96,
    paddingHorizontal: spacing.md,
  },
  dashedBorder: {
    ...StyleSheet.absoluteFillObject,
  },
  menuCardPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  menuText: {
    flex: 1,
    gap: 6,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  cardTitle: {
    color: '#000000',
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  cardText: {
    color: '#888888',
    fontSize: typography.small,
    lineHeight: 19,
  },
  popupTitle: {
    color: colors.primaryDark,
    fontSize: typography.subheading,
    fontWeight: '900',
    lineHeight: 27,
  },
  modalOverlay: {
    alignItems: 'center',
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
    width: '100%',
  },
});
