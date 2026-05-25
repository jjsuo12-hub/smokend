import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { CopingActionLinkButton } from '@/components/CopingActionLinkButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { copingActionsBySmokingType } from '@/data/copingActions';
import { smokingTypeLabels } from '@/data/smokingTypeTest';
import { colors, radius, spacing, typography } from '@/shared/styles';
import { addChecklistRecord } from '@/storage/smokingStorage';
import { ChecklistRecord, SmokingTypeId } from '@/types/smoking';
import { createId, toDateKey, toTimeKey } from '@/utils/date';

type StopSmokingChecklistScreenProps = {
  smokingType: SmokingTypeId;
  onBack: () => void;
  onCompleted: (records: ChecklistRecord[]) => void;
};

type HaltKey = keyof ChecklistRecord['halt'];
type CbtKey = keyof ChecklistRecord['cbt'];

const haltItems: { key: HaltKey; label: string }[] = [
  { key: 'hungry', label: 'Hungry: 지금 배가 고프거나 혈당이 떨어졌는가?' },
  { key: 'angry', label: 'Angry: 지금 누군가에게 화가 났거나 억울한 감정이 드는가?' },
  { key: 'lonely', label: 'Lonely: 지금 타인과 단절된 느낌이 들거나 공허한가?' },
  { key: 'tired', label: 'Tired: 지금 수면이 부족하거나 육체적으로 피로한 상태인가?' },
];

const cbtItems: { key: CbtKey; label: string }[] = [
  { key: 'stressCauseSolved', label: '내가 지금 담배를 피운다면, 나를 스트레스 받게 하는 근본적인 원인이 해결되는가?' },
  { key: 'cravingSameAfterFiveMinutes', label: '과거의 경험에 비추어 볼 때, 이 극심한 충동이 5분 뒤에도 지금과 똑같은 강도로 유지될까?' },
];

export function StopSmokingChecklistScreen({ smokingType, onBack, onCompleted }: StopSmokingChecklistScreenProps) {
  const [halt, setHalt] = useState<ChecklistRecord['halt']>({ hungry: false, angry: false, lonely: false, tired: false });
  const [cbt, setCbt] = useState<ChecklistRecord['cbt']>({ stressCauseSolved: false, cravingSameAfterFiveMinutes: false });
  const [cravingScore, setCravingScore] = useState<number | null>(null);
  const [savedRecord, setSavedRecord] = useState<ChecklistRecord | null>(null);

  const saveRecord = async () => {
    if (!cravingScore) {
      return;
    }
    const now = new Date();
    const record: ChecklistRecord = {
      id: createId('checklist'),
      createdAt: now.toISOString(),
      date: toDateKey(now),
      time: toTimeKey(now),
      halt,
      cbt,
      cravingScore,
      recommendedActions: copingActionsBySmokingType[smokingType],
      smokingTypeAtThatTime: smokingType,
    };
    const records = await addChecklistRecord(record);
    setSavedRecord(record);
    onCompleted(records);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>30초 자가 점검</Text>
          <Text style={styles.title}>흡연 멈춰! 체크리스트</Text>
          <Text style={styles.description}>순서대로 읽고 체크한 뒤, 지금 할 수 있는 행동 2가지를 바로 확인하세요.</Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>1단계: HALT 진단</Text>
          <Text style={styles.description}>
            지금 느끼는 흡연 충동이 니코틴 부족 때문인지, 아니면 배고픔·분노·외로움·피로 때문인지 먼저 확인해보세요.
          </Text>
          {haltItems.map((item) => (
            <CheckRow
              key={item.key}
              label={item.label}
              selected={halt[item.key]}
              onPress={() => setHalt((current) => ({ ...current, [item.key]: !current[item.key] }))}
            />
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>2단계: 인지적 재평가</Text>
          <Text style={styles.description}>충동적인 뇌 대신 이성적인 뇌를 활성화하기 위해, 지금 떠오르는 생각에 질문을 던져보세요.</Text>
          {cbtItems.map((item) => (
            <CheckRow
              key={item.key}
              label={item.label}
              selected={cbt[item.key]}
              onPress={() => setCbt((current) => ({ ...current, [item.key]: !current[item.key] }))}
            />
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>3단계: 현재 흡연 충동 점수</Text>
          <Text style={styles.description}>위의 항목들을 모두 읽고 실천한 지금, 나의 흡연 충동은 몇 점인가요?</Text>
          <CravingScoreSelector value={cravingScore} onChange={setCravingScore} />
          <View style={styles.scoreLabels}>
            <Text style={styles.smallText}>1점: 전혀 없음</Text>
            <Text style={styles.smallText}>10점: 견딜 수 없음</Text>
          </View>
        </Card>

        <PrimaryButton label="완료하고 대처방법 보기" onPress={saveRecord} disabled={!cravingScore} />
        <PrimaryButton label="메인으로 돌아가기" onPress={onBack} variant="secondary" />
      </ScrollView>

      <Modal visible={Boolean(savedRecord)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.sectionTitle}>지금 추천하는 흡연충동 대처방법</Text>
            <Text style={styles.smallText}>현재 흡연 유형: {smokingTypeLabels[smokingType]}</Text>
            {savedRecord?.recommendedActions.map((action) => (
              <Card key={action.title} muted>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.description}>{action.description}</Text>
                {action.examples?.map((example) => (
                  <Text key={example} style={styles.example}>“{example}”</Text>
                ))}
                <CopingActionLinkButton action={action} />
              </Card>
            ))}
            <PrimaryButton
              label="확인"
              onPress={() => {
                setSavedRecord(null);
                onBack();
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

function CheckRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={onPress} style={styles.checkRow}>
      <View style={[styles.checkBox, selected && styles.checkBoxSelected]}>
        <Text style={styles.checkMark}>{selected ? '✓' : ''}</Text>
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

function CravingScoreSelector({ value, onChange }: { value: number | null; onChange: (score: number) => void }) {
  const scores = Array.from({ length: 10 }, (_, index) => index + 1);
  const selectedScore = value ?? 0;

  return (
    <View style={styles.scoreSelector}>
      <View style={styles.radioRow}>
        {scores.map((score) => {
          const selected = selectedScore === score;
          return (
            <Pressable
              key={score}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(score)}
              style={styles.radioItem}
            >
              <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>{score}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sliderTrack}>
        {scores.map((score) => {
          const active = selectedScore >= score;
          return (
            <Pressable
              key={score}
              accessibilityRole="button"
              accessibilityLabel={`흡연 충동 점수 ${score}점`}
              onPress={() => onChange(score)}
              style={[styles.sliderSegment, active && styles.sliderSegmentActive]}
            />
          );
        })}
      </View>
      <View style={[styles.sliderThumb, { left: `${selectedScore ? (selectedScore - 1) * (100 / 9) : 0}%` }]} />
    </View>
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
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  checkBox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkBoxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '900',
  },
  checkLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    lineHeight: 22,
  },
  scoreSelector: {
    gap: spacing.md,
    position: 'relative',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioItem: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 24,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  radioLabelSelected: {
    color: colors.primary,
  },
  sliderTrack: {
    flexDirection: 'row',
    gap: 3,
    height: 16,
    paddingHorizontal: 2,
  },
  sliderSegment: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    flex: 1,
  },
  sliderSegmentActive: {
    backgroundColor: colors.primary,
  },
  sliderThumb: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryDark,
    borderRadius: 11,
    borderWidth: 2,
    bottom: -3,
    height: 22,
    marginLeft: -11,
    position: 'absolute',
    width: 22,
  },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallText: {
    color: colors.textMuted,
    fontSize: typography.small,
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
    maxHeight: '90%',
    padding: spacing.lg,
  },
  actionTitle: {
    color: colors.primaryDark,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  example: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
