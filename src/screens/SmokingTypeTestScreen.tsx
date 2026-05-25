import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SmokingTypeResultCard } from '@/components/SmokingTypeResultCard';
import { answerOptions, calculateSmokingType, smokingTypeQuestions } from '@/data/smokingTypeTest';
import { colors, spacing, typography } from '@/shared/styles';
import { saveSmokingTypeResult } from '@/storage/smokingStorage';
import { SmokingTypeResult, TestAnswerMap } from '@/types/smoking';

type SmokingTypeTestScreenProps = {
  onCompleted: (result: SmokingTypeResult) => void;
};

export function SmokingTypeTestScreen({ onCompleted }: SmokingTypeTestScreenProps) {
  const [answers, setAnswers] = useState<TestAnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<SmokingTypeResult | null>(null);
  const currentQuestion = smokingTypeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === smokingTypeQuestions.length - 1;
  const canSubmit = answeredCount === smokingTypeQuestions.length;

  const saveAnswer = (value: number) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
  };

  const submit = async () => {
    const calculated = calculateSmokingType(answers);
    const nextResult: SmokingTypeResult = {
      smokingTypeTestCompleted: true,
      smokingTypeResult: calculated.representativeType,
      smokingTypeScores: calculated.scores,
      tiedTypes: calculated.tiedTypes,
      strongTypes: calculated.strongTypes,
      smokingTypeCompletedAt: new Date().toISOString(),
    };
    await saveSmokingTypeResult(nextResult);
    setResult(nextResult);
  };

  if (result) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>흡연 유형 테스트 완료</Text>
        <SmokingTypeResultCard result={result} />
        <PrimaryButton label="시작하기" onPress={() => onCompleted(result)} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>처음 한 번만 진행합니다</Text>
        <Text style={styles.title}>흡연 유형 테스트</Text>
        <Text style={styles.description}>나에게 맞는 흡연충동 대처방법을 추천하기 위해 18개 문항에 답해주세요.</Text>
      </View>

      <Card>
        <Text style={styles.progress}>
          {currentIndex + 1} / {smokingTypeQuestions.length} · 답변 {answeredCount}개
        </Text>
        <Text style={styles.question}>{currentQuestion.id}. {currentQuestion.text}</Text>
        <View style={styles.options}>
          {answerOptions.map((option) => {
            const selected = answers[currentQuestion.id] === option.value;
            return (
              <PrimaryButton
                key={option.value}
                label={`${option.label} (${option.value}점)`}
                onPress={() => saveAnswer(option.value)}
                variant={selected ? 'primary' : 'secondary'}
              />
            );
          })}
        </View>
      </Card>

      <View style={styles.navigation}>
        <PrimaryButton
          label="이전"
          onPress={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0}
          variant="secondary"
        />
        {isLast ? (
          <PrimaryButton label="결과 보기" onPress={submit} disabled={!canSubmit} />
        ) : (
          <PrimaryButton
            label="다음"
            onPress={() => setCurrentIndex((index) => Math.min(smokingTypeQuestions.length - 1, index + 1))}
            disabled={!answers[currentQuestion.id]}
          />
        )}
      </View>
      {!canSubmit ? <Text style={styles.helper}>모든 문항에 답해야 결과를 볼 수 있습니다.</Text> : null}
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
    lineHeight: 24,
  },
  progress: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  question: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: '800',
    lineHeight: 28,
  },
  options: {
    gap: spacing.sm,
  },
  navigation: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.small,
    textAlign: 'center',
  },
});
