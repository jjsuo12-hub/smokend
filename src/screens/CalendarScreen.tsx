import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polyline } from 'react-native-svg';
import { Card } from '@/components/Card';
import { CopingActionLinkButton } from '@/components/CopingActionLinkButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { journalCopingOptions } from '@/data/copingActions';
import { smokingTypeLabels } from '@/data/smokingTypeTest';
import { colors, radius, spacing, typography } from '@/shared/styles';
import {
  addJournalRecord,
  deleteJournalRecord,
  getChecklistRecords,
  getJournalRecords,
  saveQuitProfile,
} from '@/storage/smokingStorage';
import { ChecklistRecord, JournalRecord, QuitProfile } from '@/types/smoking';
import { createId, toDateKey, toTimeKey } from '@/utils/date';

type CalendarScreenProps = {
  quitProfile: QuitProfile;
  refreshKey: number;
  onBack: () => void;
  onJournalSaved: (records: JournalRecord[]) => void;
  onQuitProfileChanged: (profile: QuitProfile) => void;
};

const customCopingOption = '기타';
const copingOptions = [...journalCopingOptions, customCopingOption];
const checklistGreen = '#22A35A';
const journalRed = '#D84848';
const stampSize = 27;

export function CalendarScreen({
  quitProfile,
  refreshKey,
  onBack,
  onJournalSaved,
  onQuitProfileChanged,
}: CalendarScreenProps) {
  const today = new Date();
  const [visibleDate, setVisibleDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [checklists, setChecklists] = useState<ChecklistRecord[]>([]);
  const [journals, setJournals] = useState<JournalRecord[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistRecord | null>(null);
  const [hadCraving, setHadCraving] = useState(false);
  const [resistedSmoking, setResistedSmoking] = useState(true);
  const [failedToResistSmoking, setFailedToResistSmoking] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [copingMethods, setCopingMethods] = useState<string[]>([]);
  const [customCopingMethod, setCustomCopingMethod] = useState('');
  const [memo, setMemo] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);

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
  const failedJournalDates = new Set(
    journals.filter((record) => record.failedToResistSmoking).map((record) => record.date),
  );
  const successfulJournalDates = new Set(
    journals
      .filter((record) => record.resistedSmoking && !record.failedToResistSmoking)
      .map((record) => record.date),
  );
  const selectedChecklists = checklists.filter((record) => record.date === selectedDate);
  const selectedJournals = journals.filter((record) => record.date === selectedDate);
  const yearOptions = useMemo(() => createYearOptions(visibleDate.getFullYear()), [visibleDate]);

  const toggleHadCraving = () => {
    setHadCraving((value) => {
      const nextValue = !value;
      if (!nextValue) {
        setResistedSmoking(false);
        setFailedToResistSmoking(false);
        setFailureReason('');
      }
      return nextValue;
    });
  };

  const toggleResistedSmoking = () => {
    setResistedSmoking((value) => {
      const nextValue = !value;
      if (nextValue) {
        setHadCraving(true);
        setFailedToResistSmoking(false);
        setFailureReason('');
      }
      return nextValue;
    });
  };

  const toggleFailedToResistSmoking = () => {
    setFailedToResistSmoking((value) => {
      const nextValue = !value;
      if (nextValue) {
        setHadCraving(true);
        setResistedSmoking(false);
      } else {
        setFailureReason('');
      }
      return nextValue;
    });
  };

  const saveJournal = async () => {
    const now = new Date();
    const record: JournalRecord = {
      id: createId('journal'),
      date: selectedDate,
      createdAt: now.toISOString(),
      hadCraving,
      resistedSmoking: hadCraving && !failedToResistSmoking ? resistedSmoking : false,
      failedToResistSmoking,
      failureReason: failedToResistSmoking ? failureReason.trim() : '',
      copingMethods,
      customCopingMethod,
      memo,
    };
    const records = await addJournalRecord(record);
    setJournals(records);

    if (failedToResistSmoking) {
      const resetProfile: QuitProfile = {
        ...quitProfile,
        quitStartDate: toDateKey(now),
        initialQuitDays: 0,
        configuredAt: now.toISOString(),
      };
      await saveQuitProfile(resetProfile);
      onQuitProfileChanged(resetProfile);
    }

    setHadCraving(false);
    setResistedSmoking(true);
    setFailedToResistSmoking(false);
    setFailureReason('');
    setCopingMethods([]);
    setCustomCopingMethod('');
    setMemo('');
    onJournalSaved(records);
  };

  const removeJournal = async (recordId: string) => {
    const records = await deleteJournalRecord(recordId);
    setJournals(records);
    onJournalSaved(records);
  };

  const selectYear = (year: number) => {
    setVisibleDate((current) => new Date(year, current.getMonth(), 1));
    setShowYearPicker(false);
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
            <Pressable accessibilityRole="button" onPress={() => setShowYearPicker(true)} style={styles.monthButton}>
              <Text style={styles.monthText}>{visibleDate.getFullYear()}년 {visibleDate.getMonth() + 1}월</Text>
              <Text style={styles.monthHint}>연도 선택</Text>
            </Pressable>
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
                  {failedJournalDates.has(dateKey) ? <OopsStamp /> : null}
                  {!failedJournalDates.has(dateKey) && successfulJournalDates.has(dateKey) ? <TriumphStamp /> : null}
                  <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
                  <View style={styles.dotRow}>
                    {checklistDates.has(dateKey) ? <View style={[styles.dot, styles.checklistDot]} /> : null}
                    {journalDates.has(dateKey) ? <View style={[styles.dot, selected ? styles.journalDotSelected : styles.journalDot]} /> : null}
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
            <View key={record.id} style={[styles.recordRow, record.failedToResistSmoking && styles.failedRecordRow]}>
              <Text style={styles.recordTitle}>{toTimeKey(new Date(record.createdAt))} 금연일기</Text>
              <Text style={styles.recordMeta}>{formatJournalCravingStatus(record)}</Text>
              {record.failedToResistSmoking ? (
                <Text style={styles.failureText}>금연 실패: 흡연욕구를 참아내지 못함</Text>
              ) : null}
              {record.failureReason ? <Text style={styles.recordMeta}>실패 이유: {record.failureReason}</Text> : null}
              {record.copingMethods.length ? (
                <Text style={styles.recordMeta}>대처 방법: {record.copingMethods.join(', ')}</Text>
              ) : null}
              {record.customCopingMethod ? <Text style={styles.recordMeta}>기타: {record.customCopingMethod}</Text> : null}
              {record.memo ? <Text style={styles.description}>{record.memo}</Text> : null}
              <PrimaryButton label="금연일기 삭제" onPress={() => removeJournal(record.id)} variant="secondary" />
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>금연일기 작성</Text>
          <ToggleRow label="오늘 흡연욕구가 있었나요?" selected={hadCraving} onPress={toggleHadCraving} />
          <ToggleRow label="흡연욕구가 있었지만 참아냈다" selected={resistedSmoking} onPress={toggleResistedSmoking} />
          <ToggleRow label="흡연욕구를 참아내지 못했다" selected={failedToResistSmoking} onPress={toggleFailedToResistSmoking} />
          {failedToResistSmoking ? (
            <TextInput
              value={failureReason}
              onChangeText={setFailureReason}
              multiline
              placeholder="왜 참아내지 못했는지 기록해 주세요"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.memoInput]}
            />
          ) : null}
          <Text style={styles.label}>사용한 대처 방법</Text>
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
              placeholder="기타 대처 방법"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          ) : null}
          <TextInput
            value={memo}
            onChangeText={setMemo}
            multiline
            placeholder="지금의 메모"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.memoInput]}
          />
          <PrimaryButton
            label={failedToResistSmoking ? '금연 실패 기록하고 일수 초기화' : '금연일기 저장'}
            onPress={saveJournal}
          />
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
                  <Text style={styles.recordTitle}>추천받은 대처 방법</Text>
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

      <Modal visible={showYearPicker} transparent animationType="slide">
        <View style={styles.yearModalOverlay}>
          <View style={styles.yearModal}>
            <Text style={styles.sectionTitle}>연도 선택</Text>
            <ScrollView contentContainerStyle={styles.yearList}>
              {yearOptions.map((year) => {
                const selected = year === visibleDate.getFullYear();
                return (
                  <Pressable
                    key={year}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectYear(year)}
                    style={[styles.yearOption, selected && styles.yearOptionSelected]}
                  >
                    <Text style={[styles.yearOptionText, selected && styles.yearOptionTextSelected]}>{year}년</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <PrimaryButton label="닫기" onPress={() => setShowYearPicker(false)} variant="secondary" />
          </View>
        </View>
      </Modal>
    </>
  );
}

function OopsStamp() {
  return (
    <View pointerEvents="none" style={styles.oopsStamp}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
        <Path
          d="M 100 25 C 145 22, 178 55, 175 100 C 172 145, 145 178, 100 175 C 55 172, 22 145, 25 100 C 28 55, 55 28, 100 25 Z"
          fill="#FFE082"
          stroke="#F5B041"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <Ellipse cx="60" cy="110" rx="14" ry="9" fill="#FF5252" opacity="0.4" />
        <Ellipse cx="140" cy="110" rx="14" ry="9" fill="#FF5252" opacity="0.4" />
        <Polyline points="55,75 75,85 55,95" fill="none" stroke="#424242" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="145,75 125,85 145,95" fill="none" stroke="#424242" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 85 130 Q 100 115 115 130" fill="none" stroke="#424242" strokeWidth="7" strokeLinecap="round" />
        <G transform="translate(10, -20) rotate(15 150 50)">
          <Path d="M 150 20 Q 148 40 150 60" fill="none" stroke="#E53935" strokeWidth="12" strokeLinecap="round" />
          <Circle cx="150" cy="80" r="6" fill="#E53935" />
        </G>
      </Svg>
    </View>
  );
}

function TriumphStamp() {
  return (
    <View pointerEvents="none" style={styles.calendarStamp}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
        <Path
          d="M 100 25 C 145 22, 178 55, 175 100 C 172 145, 145 178, 100 175 C 55 172, 22 145, 25 100 C 28 55, 55 28, 100 25 Z"
          fill="#FFE082"
          stroke="#F5B041"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <Ellipse cx="50" cy="115" rx="18" ry="12" fill="#FF8A80" opacity="0.7" />
        <Ellipse cx="150" cy="115" rx="18" ry="12" fill="#FF8A80" opacity="0.7" />
        <Line x1="42" y1="120" x2="48" y2="110" stroke="#FF5252" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <Line x1="50" y1="120" x2="56" y2="110" stroke="#FF5252" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <Line x1="142" y1="120" x2="148" y2="110" stroke="#FF5252" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <Line x1="150" y1="120" x2="156" y2="110" stroke="#FF5252" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <Path d="M 45 75 Q 60 65 75 72" fill="none" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
        <Path d="M 125 72 Q 140 65 155 75" fill="none" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
        <Path d="M 42 95 Q 60 72 78 95" fill="none" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
        <Path d="M 122 95 Q 140 72 158 95" fill="none" stroke="#5D4037" strokeWidth="8" strokeLinecap="round" />
        <Path
          d="M 75 120 Q 100 125 125 120 Q 120 150 100 150 Q 80 150 75 120 Z"
          fill="#FF8A80"
          stroke="#5D4037"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <Path d="M 85 140 Q 100 130 115 140 Q 110 150 100 150 Q 90 150 85 140 Z" fill="#FF5252" />
        <G transform="translate(135, 10) rotate(15)">
          <Path
            d="M 10 25 C 0 5, 35 -5, 45 15 C 55 35, 25 55, 10 35 C 2 25, 10 15, 15 15"
            fill="none"
            stroke="#43A047"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Path d="M 20 60 Q 30 60 30 50 Q 30 60 40 60 Q 30 60 30 70 Q 30 60 20 60 Z" fill="#FFF176" stroke="#FBC02D" strokeWidth="2" />
      </Svg>
    </View>
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

function createYearOptions(centerYear: number) {
  const startYear = centerYear - 30;
  return Array.from({ length: 61 }, (_, index) => startYear + index);
}

function formatJournalCravingStatus(record: JournalRecord) {
  if (!record.hadCraving) {
    return '흡연욕구 없음';
  }
  if (record.failedToResistSmoking) {
    return '흡연욕구가 있었고 참아내지 못함';
  }
  return record.resistedSmoking ? '흡연욕구가 있었지만 참아냄' : '흡연욕구 있음';
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
    `5분 후 충동 질문: ${record.cbt.cravingSameAfterFiveMinutes ? '체크함' : '체크 안 함'}`,
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
    textAlign: 'center',
  },
  monthButton: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  monthHint: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
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
    overflow: 'hidden',
    width: `${100 / 7}%`,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    zIndex: 2,
  },
  dayTextSelected: {
    color: colors.surface,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
    marginTop: 2,
    zIndex: 2,
  },
  oopsStamp: {
    height: stampSize,
    opacity: 0.82,
    position: 'absolute',
    right: 1,
    top: 1,
    width: stampSize,
    zIndex: 1,
  },
  calendarStamp: {
    height: stampSize,
    opacity: 0.86,
    position: 'absolute',
    right: 1,
    top: 1,
    width: stampSize,
    zIndex: 1,
  },
  dot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  checklistDot: {
    backgroundColor: checklistGreen,
  },
  journalDot: {
    backgroundColor: journalRed,
  },
  journalDotSelected: {
    backgroundColor: colors.surface,
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
  failedRecordRow: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  recordTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  recordMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
  },
  failureText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '900',
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
  yearModalOverlay: {
    alignItems: 'center',
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
  yearModal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.md,
    maxHeight: '80%',
    maxWidth: 360,
    padding: spacing.lg,
    width: '100%',
  },
  yearList: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  yearOption: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  yearOptionSelected: {
    backgroundColor: colors.primary,
  },
  yearOptionText: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
  },
  yearOptionTextSelected: {
    color: colors.surface,
  },
});
