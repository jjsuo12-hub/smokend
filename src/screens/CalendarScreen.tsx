import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '@/components/Card';
import { CopingActionLinkButton } from '@/components/CopingActionLinkButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { journalCopingOptions } from '@/data/copingActions';
import { smokingTypeLabels } from '@/data/smokingTypeTest';
import { colors, radius, spacing, typography } from '@/shared/styles';
import { addJournalRecord, getChecklistRecords, getJournalRecords } from '@/storage/smokingStorage';
import { ChecklistRecord, JournalRecord } from '@/types/smoking';
import { createId, toDateKey, toTimeKey } from '@/utils/date';

type CalendarScreenProps = {
  refreshKey: number;
  onBack: () => void;
  onJournalSaved: (records: JournalRecord[]) => void;
};

const customCopingOption = '기타';
const copingOptions = [...journalCopingOptions, customCopingOption];

export function CalendarScreen({ refreshKey, onBack, onJournalSaved }: CalendarScreenProps) {
  const today = new Date();
  const [visibleDate, setVisibleDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [checklists, setChecklists] = useState<ChecklistRecord[]>([]);
  const [journals, setJournals] = useState<JournalRecord[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistRecord | null>(null);
  const [hadCraving, setHadCraving] = useState(false);
  const [resistedSmoking, setResistedSmoking] = useState(true);
  const [copingMethods, setCopingMethods] = useState<string[]>([]);
  const [customCopingMethod, setCustomCopingMethod] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    async function loadRecords() {
      const [savedChecklists, savedJournals] = await Promise.all([getChecklistRecords(), getJournalRecords()]);
      setChecklists(savedChecklists);
      setJournals(savedJournals);
    }
    void loadRecords();
  }, [refreshKey]);

  const calendarDays = useMemo(() => createCalendarDays(visibleDate), [visibleDate]);
  const checklistDates = new Set(checklists.map((record) => record.date));
  const journalDates = new Set(journals.map((record) => record.date));
  const selectedChecklists = checklists.filter((record) => record.date === selectedDate);
  const selectedJournals = journals.filter((record) => record.date === selectedDate);

  const saveJournal = async () => {
    const now = new Date();
    const record: JournalRecord = {
      id: createId('journal'),
      date: selectedDate,
      createdAt: now.toISOString(),
      hadCraving,
      resistedSmoking,
      copingMethods,
      customCopingMethod,
      memo,
    };
    const records = await addJournalRecord(record);
    setJournals(records);
    setHadCraving(false);
    setResistedSmoking(true);
    setCopingMethods([]);
    setCustomCopingMethod('');
    setMemo('');
    onJournalSaved(records);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>금연 캘린더</Text>
          <Text style={styles.description}>체크리스트와 금연일기를 날짜별로 확인합니다.</Text>
        </View>

        <Card>
          <View style={styles.monthHeader}>
            <PrimaryButton label="이전 달" onPress={() => setVisibleDate(addMonths(visibleDate, -1))} variant="secondary" />
            <Text style={styles.monthText}>{visibleDate.getFullYear()}년 {visibleDate.getMonth() + 1}월</Text>
            <PrimaryButton label="다음 달" onPress={() => setVisibleDate(addMonths(visibleDate, 1))} variant="secondary" />
          </View>
          <View style={styles.weekRow}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <Text key={day} style={styles.weekText}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((dateKey, index) => {
              if (!dateKey) {
                return <View key={`blank-${index}`} style={styles.dayCell} />;
              }
              const day = Number(dateKey.slice(-2));
              const selected = selectedDate === dateKey;
              return (
                <Pressable
                  key={dateKey}
                  accessibilityRole="button"
                  onPress={() => setSelectedDate(dateKey)}
                  style={[styles.dayCell, selected && styles.dayCellSelected]}
                >
                  <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
                  <View style={styles.dotRow}>
                    {checklistDates.has(dateKey) ? <View style={[styles.dot, styles.checklistDot]} /> : null}
                    {journalDates.has(dateKey) ? <View style={[styles.dot, styles.journalDot]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.legend}>초록 점: 체크리스트 · 주황 점: 금연일기</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>{selectedDate} 기록</Text>
          {selectedChecklists.length === 0 && selectedJournals.length === 0 ? (
            <Text style={styles.description}>아직 기록이 없습니다.</Text>
          ) : null}
          {selectedChecklists.map((record) => (
            <Pressable key={record.id} onPress={() => setSelectedChecklist(record)} style={styles.recordRow}>
              <Text style={styles.recordTitle}>{record.time} 흡연 멈춰! 체크리스트</Text>
              <Text style={styles.recordMeta}>충동 {record.cravingScore}점 · {smokingTypeLabels[record.smokingTypeAtThatTime]}</Text>
            </Pressable>
          ))}
          {selectedJournals.map((record) => (
            <View key={record.id} style={styles.recordRow}>
              <Text style={styles.recordTitle}>{toTimeKey(new Date(record.createdAt))} 금연일기</Text>
              <Text style={styles.recordMeta}>
                {record.hadCraving ? '흡연욕구 있음' : '흡연욕구 없음'} · {record.resistedSmoking ? '참아냄' : '참지 못함'}
              </Text>
              {record.copingMethods.length ? (
                <Text style={styles.recordMeta}>대처방법: {record.copingMethods.join(', ')}</Text>
              ) : null}
              {record.customCopingMethod ? <Text style={styles.recordMeta}>기타: {record.customCopingMethod}</Text> : null}
              {record.memo ? <Text style={styles.description}>{record.memo}</Text> : null}
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>금연일기 작성</Text>
          <ToggleRow label="오늘 흡연욕구가 있었다" selected={hadCraving} onPress={() => setHadCraving((value) => !value)} />
          <ToggleRow label="흡연욕구가 있었지만 참아냈다" selected={resistedSmoking} onPress={() => setResistedSmoking((value) => !value)} />
          <Text style={styles.label}>사용한 대처방법</Text>
          <View style={styles.chipWrap}>
            {copingOptions.map((option) => {
              const selected = copingMethods.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() =>
                    setCopingMethods((current) =>
                      selected ? current.filter((item) => item !== option) : [...current, option],
                    )
                  }
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
          {copingMethods.includes(customCopingOption) ? (
            <TextInput
              value={customCopingMethod}
              onChangeText={setCustomCopingMethod}
              placeholder="기타 대처방법"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          ) : null}
          <TextInput
            value={memo}
            onChangeText={setMemo}
            multiline
            placeholder="짧은 메모"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.memoInput]}
          />
          <PrimaryButton label="금연일기 저장" onPress={saveJournal} />
        </Card>

        <PrimaryButton label="메인으로 돌아가기" onPress={onBack} variant="secondary" />
      </ScrollView>

      <Modal visible={Boolean(selectedChecklist)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.sectionTitle}>체크리스트 상세</Text>
              {selectedChecklist ? (
                <>
                  <Text style={styles.description}>{selectedChecklist.date} {selectedChecklist.time}</Text>
                  <Text style={styles.recordTitle}>HALT 체크</Text>
                  <Text style={styles.description}>{formatHalt(selectedChecklist)}</Text>
                  <Text style={styles.recordTitle}>CBT 체크</Text>
                  <Text style={styles.description}>{formatCbt(selectedChecklist)}</Text>
                  <Text style={styles.recordTitle}>흡연 충동 점수</Text>
                  <Text style={styles.description}>{selectedChecklist.cravingScore}점</Text>
                  <Text style={styles.recordTitle}>당시 흡연 유형</Text>
                  <Text style={styles.description}>{smokingTypeLabels[selectedChecklist.smokingTypeAtThatTime]}</Text>
                  <Text style={styles.recordTitle}>추천받은 대처방법</Text>
                  {selectedChecklist.recommendedActions.map((action) => (
                    <Card key={action.title} muted>
                      <Text style={styles.recordTitle}>{action.title}</Text>
                      <Text style={styles.description}>{action.description}</Text>
                      <CopingActionLinkButton action={action} />
                    </Card>
                  ))}
                </>
              ) : null}
              <PrimaryButton label="닫기" onPress={() => setSelectedChecklist(null)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ToggleRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.toggleRow}>
      <View style={[styles.toggle, selected && styles.toggleSelected]}>
        <Text style={[styles.toggleText, selected && styles.toggleTextSelected]}>{selected ? '예' : '아니오'}</Text>
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

function createCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days: (string | null)[] = Array.from({ length: firstDay }, () => null);
  for (let day = 1; day <= lastDate; day += 1) {
    days.push(toDateKey(new Date(year, month, day)));
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatHalt(record: ChecklistRecord) {
  const values = [
    record.halt.hungry ? '배고픔' : '',
    record.halt.angry ? '분노' : '',
    record.halt.lonely ? '외로움' : '',
    record.halt.tired ? '피로' : '',
  ].filter(Boolean);
  return values.length ? values.join(', ') : '해당 없음';
}

function formatCbt(record: ChecklistRecord) {
  return [
    `근본 원인 해결 질문: ${record.cbt.stressCauseSolved ? '체크함' : '체크 안 함'}`,
    `5분 뒤 충동 질문: ${record.cbt.cravingSameAfterFiveMinutes ? '체크함' : '체크 안 함'}`,
  ].join('\n');
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
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  monthText: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 48,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: colors.surface,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
    marginTop: 2,
  },
  dot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  checklistDot: {
    backgroundColor: colors.primary,
  },
  journalDot: {
    backgroundColor: colors.accent,
  },
  legend: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  recordRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  recordTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  recordMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    height: 36,
    justifyContent: 'center',
    width: 64,
  },
  toggleSelected: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  toggleTextSelected: {
    color: colors.surface,
  },
  checkLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: colors.surface,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 46,
    padding: spacing.md,
  },
  memoInput: {
    minHeight: 96,
    textAlignVertical: 'top',
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
    maxHeight: '88%',
    padding: spacing.lg,
  },
  modalContent: {
    gap: spacing.md,
  },
});
