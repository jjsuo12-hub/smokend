import { SmokingTypeId, SmokingTypeScoreMap, TestAnswerMap } from '@/types/smoking';

export const smokingTypeLabels: Record<SmokingTypeId, string> = {
  stimulation: '자극 추구형',
  handBoredom: '손에 담배가 없으면 무료한 형',
  pleasure: '즐거움 추구형',
  stressRelief: '스트레스 해소형',
  dependence: '의존형',
  habit: '습관형',
};

export const smokingTypeOrder: SmokingTypeId[] = [
  'stimulation',
  'handBoredom',
  'pleasure',
  'stressRelief',
  'dependence',
  'habit',
];

export const answerOptions = [
  { label: '항상 그렇다', value: 5 },
  { label: '자주 그렇다', value: 4 },
  { label: '가끔 그렇다', value: 3 },
  { label: '드물게 그렇다', value: 2 },
  { label: '결코 아니다', value: 1 },
];

export const smokingTypeQuestions = [
  { id: 'A', text: '긴장이 풀리는 것을 막기 위해 담배를 피운다.' },
  { id: 'B', text: '담배를 손에 잡고 피우는 행위는 흡연하는 즐거움 중의 하나이다.' },
  { id: 'C', text: '흡연은 편안과 즐거움을 준다.' },
  { id: 'D', text: '화가 날 때 담배를 피운다.' },
  { id: 'E', text: '담배가 떨어지면 담배를 살 때까지 참을 수 없다.' },
  { id: 'F', text: '무의식적으로 담배를 피운다.' },
  { id: 'G', text: '담배는 기운이 나게 해준다.' },
  { id: 'H', text: '담배에 불 붙이는 순간은 흡연의 즐거움 중 하나이다.' },
  { id: 'I', text: '담배는 기분을 좋게 만들어준다.' },
  { id: 'J', text: '기분이 좋지 않을 때, 담배를 피운다.' },
  { id: 'K', text: '담배를 피우지 않을 때, 안 피우고 있다는 사실을 많이 의식한다.' },
  { id: 'L', text: '담배를 피우면서 타고 있는 담배를 잊어버린 채 새 담배에 불을 붙인다.' },
  { id: 'M', text: '기분 전환을 위해 담배를 피운다.' },
  { id: 'N', text: '흡연의 즐거움 중 하나는 내가 내뿜는 담배 연기를 바라보는 것이다.' },
  { id: 'O', text: '담배를 제일 피우고 싶을 때는 느긋하고 편안할 때이다.' },
  { id: 'P', text: '기분이 우울하거나 걱정거리에서 벗어나고 싶을 때 담배를 피운다.' },
  { id: 'Q', text: '담배를 한동안 피우지 않으면, 계속 지속되는 흡연 욕구로 괴롭다.' },
  { id: 'R', text: '나도 모르는 사이에 담배를 입에 물고 있는 것을 발견하곤 한다.' },
];

const scoreGroups: Record<SmokingTypeId, string[]> = {
  stimulation: ['A', 'G', 'M'],
  handBoredom: ['B', 'H', 'N'],
  pleasure: ['C', 'I', 'O'],
  stressRelief: ['D', 'J', 'P'],
  dependence: ['E', 'K', 'Q'],
  habit: ['F', 'L', 'R'],
};

export function calculateSmokingType(answers: TestAnswerMap) {
  const scores = smokingTypeOrder.reduce((acc, type) => {
    acc[type] = scoreGroups[type].reduce((sum, questionId) => sum + (answers[questionId] ?? 0), 0);
    return acc;
  }, {} as SmokingTypeScoreMap);

  const highestScore = Math.max(...smokingTypeOrder.map((type) => scores[type]));
  const tiedTypes = smokingTypeOrder.filter((type) => scores[type] === highestScore);
  const strongTypes = smokingTypeOrder.filter((type) => scores[type] >= 11);

  return {
    representativeType: tiedTypes[0],
    scores,
    tiedTypes,
    strongTypes,
  };
}
