export type SmokingTypeId =
  | 'stimulation'
  | 'handBoredom'
  | 'pleasure'
  | 'stressRelief'
  | 'dependence'
  | 'habit';

export type SmokingTypeScoreMap = Record<SmokingTypeId, number>;

export type SmokingTypeResult = {
  smokingTypeTestCompleted: true;
  smokingTypeResult: SmokingTypeId;
  smokingTypeScores: SmokingTypeScoreMap;
  tiedTypes: SmokingTypeId[];
  strongTypes: SmokingTypeId[];
  smokingTypeCompletedAt: string;
};

export type TestAnswerMap = Record<string, number>;

export type CopingAction = {
  title: string;
  description: string;
  examples?: string[];
  link?: {
    label: string;
    url: string;
  };
};

export type QuitProfile = {
  quitStartDate: string;
  initialQuitDays: number;
  configuredAt: string;
  notificationEnabled: boolean;
  reminderTime: string;
};

export type WithdrawalInfoItem = {
  id: string;
  minDay: number;
  maxDay?: number;
  title: string;
  description: string;
};

export type ChecklistRecord = {
  id: string;
  createdAt: string;
  date: string;
  time: string;
  halt: {
    hungry: boolean;
    angry: boolean;
    lonely: boolean;
    tired: boolean;
  };
  cbt: {
    stressCauseSolved: boolean;
    cravingSameAfterFiveMinutes: boolean;
  };
  cravingScore: number;
  recommendedActions: CopingAction[];
  smokingTypeAtThatTime: SmokingTypeId;
};

export type JournalRecord = {
  id: string;
  date: string;
  createdAt: string;
  hadCraving: boolean;
  resistedSmoking: boolean;
  failedToResistSmoking: boolean;
  failureReason: string;
  copingMethods: string[];
  customCopingMethod: string;
  memo: string;
};

export type AppScreen =
  | 'home'
  | 'checklist'
  | 'calendar'
  | 'withdrawal'
  | 'patternAnalysis';
