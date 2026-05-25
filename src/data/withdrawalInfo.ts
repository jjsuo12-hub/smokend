import { WithdrawalInfoItem } from '@/types/smoking';

export const defaultNotificationTime = '07:30';

export const withdrawalInfoCards = [
  '금연 초기에는 짜증, 불안, 집중력 저하가 나타날 수 있습니다.',
  '흡연 충동은 보통 시간이 지나면 강도가 낮아집니다.',
  '물 마시기, 심호흡, 짧은 산책은 금단 증상 완화에 도움이 됩니다.',
  '오늘의 목표는 완벽한 금연이 아니라 한 번의 충동을 넘기는 것입니다.',
];

export const withdrawalTimeline: WithdrawalInfoItem[] = [
  {
    id: 'day-0',
    minDay: 0,
    maxDay: 1,
    title: '몸이 금연 상태를 알아차리는 시기입니다.',
    description: '초기에는 입이 허전하거나 습관적으로 담배를 찾을 수 있습니다. 물을 마시고 3분만 다른 행동으로 넘겨보세요.',
  },
  {
    id: 'day-2-3',
    minDay: 2,
    maxDay: 3,
    title: '흡연 충동이 강하게 올라올 수 있습니다.',
    description: '니코틴 금단이 또렷하게 느껴질 수 있습니다. 충동은 파도처럼 올라왔다가 내려가므로 체크리스트와 대처방법을 바로 사용하세요.',
  },
  {
    id: 'day-4-7',
    minDay: 4,
    maxDay: 7,
    title: '짜증, 피로, 집중력 저하가 나타날 수 있습니다.',
    description: '수면과 식사를 먼저 챙기면 가짜 흡연 충동을 줄이는 데 도움이 됩니다. 오늘은 한 번의 충동을 넘기는 것에 집중하세요.',
  },
  {
    id: 'day-8-14',
    minDay: 8,
    maxDay: 14,
    title: '습관적 흡연 신호를 다시 만나는 시기입니다.',
    description: '식후, 이동 전, 쉬는 시간처럼 익숙한 상황에서 충동이 생길 수 있습니다. 양치질, 산책, 음악 듣기처럼 대체 루틴을 정해두세요.',
  },
  {
    id: 'day-15-30',
    minDay: 15,
    maxDay: 30,
    title: '몸은 적응 중이고 마음은 방심하기 쉽습니다.',
    description: '한 개비만 괜찮다는 생각이 들 수 있습니다. 금연하는 이유 3가지를 소리 내어 말하고 오늘의 기록을 남겨보세요.',
  },
  {
    id: 'day-31',
    minDay: 31,
    title: '유지 전략이 중요해지는 시기입니다.',
    description: '충동이 줄어도 특정 스트레스 상황에서는 다시 올라올 수 있습니다. 나에게 잘 맞았던 대처방법을 금연일기에 계속 기록하세요.',
  },
];

export type WithdrawalReminderSettings = {
  enabled: boolean;
  time: string;
};

export const initialWithdrawalReminderSettings: WithdrawalReminderSettings = {
  enabled: false,
  time: defaultNotificationTime,
};

export function getWithdrawalInfoForQuitDay(quitDay: number) {
  return (
    withdrawalTimeline.find((item) => quitDay >= item.minDay && (item.maxDay === undefined || quitDay <= item.maxDay)) ??
    withdrawalTimeline[withdrawalTimeline.length - 1]
  );
}
