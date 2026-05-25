import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/shared/styles';
import { getQuitProfile, getSmokingTypeResult } from '@/storage/smokingStorage';
import { AppScreen, ChecklistRecord, JournalRecord, QuitProfile, SmokingTypeResult } from '@/types/smoking';
import { CalendarScreen } from './CalendarScreen';
import { HomeScreen } from './HomeScreen';
import { PatternAnalysisScreen } from './PatternAnalysisScreen';
import { QuitSetupScreen } from './QuitSetupScreen';
import { SmokingTypeTestScreen } from './SmokingTypeTestScreen';
import { StopSmokingChecklistScreen } from './StopSmokingChecklistScreen';
import { WithdrawalInfoScreen } from './WithdrawalInfoScreen';

export default function AppRoot() {
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<SmokingTypeResult | null>(null);
  const [quitProfile, setQuitProfile] = useState<QuitProfile | null>(null);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [refreshKey, setRefreshKey] = useState(0);

  const loadResult = useCallback(async () => {
    const [savedResult, savedQuitProfile] = await Promise.all([getSmokingTypeResult(), getQuitProfile()]);
    setTestResult(savedResult);
    setQuitProfile(savedQuitProfile);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadResult();
  }, [loadResult]);

  const handleTestCompleted = (result: SmokingTypeResult) => {
    setTestResult(result);
    setScreen('home');
  };

  const handleQuitSetupCompleted = (profile: QuitProfile) => {
    setQuitProfile(profile);
    setScreen('home');
  };

  const handleRecordsChanged = (_records?: ChecklistRecord[] | JournalRecord[]) => {
    setRefreshKey((current) => current + 1);
  };

  const handleQuitProfileChanged = (profile: QuitProfile) => {
    setQuitProfile(profile);
    setRefreshKey((current) => current + 1);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!testResult?.smokingTypeTestCompleted) {
    return <SmokingTypeTestScreen onCompleted={handleTestCompleted} />;
  }

  if (!quitProfile) {
    return <QuitSetupScreen onCompleted={handleQuitSetupCompleted} />;
  }

  if (screen === 'checklist') {
    return (
      <StopSmokingChecklistScreen
        smokingType={testResult.smokingTypeResult}
        onBack={() => setScreen('home')}
        onCompleted={handleRecordsChanged}
      />
    );
  }

  if (screen === 'calendar') {
    return (
      <CalendarScreen
        quitProfile={quitProfile}
        refreshKey={refreshKey}
        onBack={() => setScreen('home')}
        onJournalSaved={handleRecordsChanged}
        onQuitProfileChanged={handleQuitProfileChanged}
      />
    );
  }

  if (screen === 'withdrawal') {
    return <WithdrawalInfoScreen quitProfile={quitProfile} onBack={() => setScreen('home')} />;
  }

  if (screen === 'patternAnalysis') {
    return (
      <PatternAnalysisScreen
        refreshKey={refreshKey}
        onBack={() => setScreen('home')}
        onOpenChecklist={() => setScreen('checklist')}
      />
    );
  }

  return (
    <HomeScreen
      result={testResult}
      quitProfile={quitProfile}
      onOpenChecklist={() => setScreen('checklist')}
      onOpenCalendar={() => setScreen('calendar')}
      onOpenPatternAnalysis={() => setScreen('patternAnalysis')}
      onOpenWithdrawal={() => setScreen('withdrawal')}
      onResetTest={() => {
        setTestResult(null);
        setQuitProfile(null);
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
