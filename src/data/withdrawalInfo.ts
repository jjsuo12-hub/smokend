import { WithdrawalInfoItem } from '@/types/smoking';

export const defaultNotificationTime = '07:30';

export const withdrawalInfoCards = [
  '금단증상은 회복 과정에서 나타나는 정상적인 변화입니다.',
  '흡연욕구는 오래 지속되지 않는 신호입니다. 5분만 넘겨보세요.',
  '물 마시기, 양치, 짧은 산책은 흡연욕구를 넘기는 데 도움이 됩니다.',
  '오늘의 목표는 한 번의 충동을 넘기는 것입니다.',
];

export const withdrawalMessages: Record<number, string> = {
  0: '금연이 시작되었습니다. 오늘은 몸이 니코틴 없는 상태에 적응을 시작하는 날입니다.',
  1: '오늘은 흡연욕구가 강해질 수 있습니다. 5분만 넘겨보세요.',
  2: '금단증상이 강해지는 시기입니다. 지금 힘든 건 회복 과정입니다.',
  3: '오늘이 가장 힘든 고비일 수 있습니다. 여기까지 온 것만으로도 의미가 있습니다.',
  4: '강한 고비를 지나고 있습니다. 몸은 조금씩 적응 중입니다.',
  5: '오늘은 입이 심심하거나 식욕이 늘 수 있습니다. 가벼운 대체행동을 해보세요.',
  6: '불면이나 피로감이 남아도 몸은 회복 중입니다.',
  7: '첫 1주를 넘겼습니다. 금단의 가장 어려운 구간을 통과했습니다.',
  8: '오늘부터는 ‘습관성 흡연욕구’ 관리가 중요합니다.',
  9: '갑자기 담배 생각이 나도 이상한 일이 아닙니다.',
  10: '짜증이 줄어드는 시기입니다. 감정 변화를 관찰해보세요.',
  11: '집중이 잘 안 되어도 괜찮습니다. 뇌가 니코틴 없는 상태에 적응 중입니다.',
  12: '오늘의 목표는 완벽한 금연이 아니라 한 번의 충동을 넘기는 것입니다.',
  13: '입이 심심하면 담배 대신 물, 껌, 양치로 바꿔보세요.',
  14: '2주차에 들어섰습니다. 신체적 금단은 점차 줄어드는 시기입니다.',
  15: '오늘은 ‘내가 담배를 찾는 순간’을 확인해보세요.',
  16: '스트레스가 담배를 부르는 날일 수 있습니다. 먼저 숨을 고르세요.',
  17: '금연은 참는 것만이 아니라 새로운 습관을 만드는 과정입니다.',
  18: '오늘의 흡연욕구는 지나가는 신호입니다. 기록하면 약해집니다.',
  19: '기분이 가라앉는 날도 있을 수 있습니다. 담배 없이 회복하는 연습 중입니다.',
  20: '지금 필요한 것은 담배가 아니라 휴식일 수 있습니다.',
  21: '3주차입니다. 흡연욕구의 빈도는 점차 줄어들 수 있습니다.',
  22: '식후 담배 생각이 난다면 바로 일어나 움직여보세요.',
  23: '오늘은 흡연장 근처를 피하는 것이 금연 성공 행동입니다.',
  24: '담배 생각이 줄었다면, 몸이 적응하고 있다는 신호입니다.',
  25: '오늘은 나의 금연 이유를 다시 확인해보세요.',
  26: '흡연욕구가 갑자기 와도 실패가 아닙니다.',
  27: '오늘은 ‘담배 없이 버틴 순간’을 하나 기록해보세요.',
  28: '4주차입니다. 급성 금단증상은 많이 줄어드는 시기입니다.',
  29: '방심이 재흡연을 부를 수 있습니다. 오늘도 한 번만 더 참아보세요.',
  30: '금연 1개월입니다. 이제는 ‘유지’가 목표입니다.',
};

export const longTermWithdrawalMessages = [
  '오늘 담배 생각이 났다면, 그것은 실패가 아니라 오래된 습관이 다시 올라온 것입니다.',
  '식후 담배 생각이 날 수 있습니다. 지금은 양치, 물 마시기, 3분 걷기로 넘겨보세요.',
  '피곤할수록 담배 생각이 강해질 수 있습니다. 담배보다 먼저 휴식을 주세요.',
  '지금 필요한 것은 니코틴이 아니라 진정입니다. 3분 호흡을 먼저 해보세요.',
  '음주는 재흡연 위험을 높일 수 있습니다. 오늘은 ‘한 대도 피우지 않기’를 목표로 해보세요.',
  '흡연장 근처에서는 갈망이 다시 강해질 수 있습니다. 지금은 자리를 옮기는 것이 가장 좋은 선택입니다.',
];

export const withdrawalTimeline: WithdrawalInfoItem[] = [
  ...Object.entries(withdrawalMessages).map(([day, description]) => ({
    id: `day-${day}`,
    minDay: Number(day),
    maxDay: Number(day),
    title: `D+${day}`,
    description,
  })),
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
  if (quitDay >= 0 && quitDay <= 30) {
    return {
      id: `day-${quitDay}`,
      minDay: quitDay,
      maxDay: quitDay,
      title: `D+${quitDay}`,
      description: withdrawalMessages[quitDay],
    };
  }

  return {
    id: 'day-31',
    minDay: 31,
    title: 'D+31 이후',
    description: longTermWithdrawalMessages[0],
  };
}
