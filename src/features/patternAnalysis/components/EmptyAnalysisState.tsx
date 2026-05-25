import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing, typography } from '@/shared/styles';

type EmptyAnalysisStateProps = {
  onOpenChecklist: () => void;
};

export function EmptyAnalysisState({ onOpenChecklist }: EmptyAnalysisStateProps) {
  return (
    <Card>
      <Text style={styles.title}>아직 분석할 기록이 없어요.</Text>
      <Text style={styles.description}>
        흡연 충동이 올 때 메인 화면의 ‘지금 담배 피우고 싶어요’ 버튼을 눌러 체크리스트를 작성하면, 이곳에서 나의 패턴을 확인할 수 있어요.
      </Text>
      <PrimaryButton label="30초 체크리스트 작성하러 가기" onPress={onOpenChecklist} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginBottom: spacing.sm,
  },
});
