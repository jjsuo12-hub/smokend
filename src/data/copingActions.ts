import { CopingAction, SmokingTypeId } from '@/types/smoking';

export const miniGameUrl = 'https://poki.com/kr/g/longcat#fullscreen';

export const copingActionsBySmokingType: Record<SmokingTypeId, CopingAction[]> = {
  stimulation: [
    {
      title: '입안에 얼음 물고 있기',
      description: '강렬한 차가움 감각을 통해 뇌를 즉각적으로 자극하고 깨우는 데 도움을 줍니다.',
    },
    {
      title: '배나 발 끝에 힘을 주고 풀기',
      description: '근육에 강한 긴장을 주었다가 푸는 과정에서 신체에 활력을 불어넣고 무기력함이나 졸음을 줄이는 데 도움을 줍니다.',
    },
  ],
  handBoredom: [
    {
      title: '간단한 게임하기',
      description: '스마트폰 게임 등을 통해 손가락을 바쁘게 움직이면 손의 무료함을 빠르게 달랠 수 있습니다.',
      link: {
        label: '미니게임 바로가기',
        url: miniGameUrl,
      },
    },
    {
      title: '반대 손으로 담배를 쥐는 시늉 해보기',
      description: '평소와 다른 손을 사용하면 뇌가 어색함을 느끼고, 자동화된 흡연 행동 패턴이 깨지는 데 도움을 줍니다.',
    },
  ],
  pleasure: [
    {
      title: '온라인담타 사용하기',
      description: '담배를 피우지 않더라도 기존의 쉬는 시간, 담배 타임이 주던 심리적 여유와 소통의 즐거움을 대체합니다.',
    },
    {
      title: '3분 정도 좋아하는 음악 듣기',
      description: '청각적 자극을 통해 기분 전환과 즐거움을 얻을 수 있습니다.',
    },
  ],
  stressRelief: [
    {
      title: '심호흡하기',
      description: '천천히 깊게 호흡하여 스트레스 반응을 낮추고 몸을 안정시키는 데 도움을 줍니다.',
    },
    {
      title: '몸에 힘을 풀고 신체적 이완하기',
      description: '목, 어깨, 턱, 손의 힘을 의식적으로 빼면서 몸이 안전하고 편안하다는 신호를 보냅니다.',
    },
  ],
  dependence: [
    {
      title: '고개를 숙여서 이중턱 만들기',
      description: '불안과 초조감이 올라올 때 목 부위를 부드럽게 압박하여 신체를 진정시키는 응급 대처법으로 사용합니다.',
    },
    {
      title: '금연하는 이유 3가지 소리내서 말해보기',
      description: '흡연 충동이라는 단기적 본능이 올라올 때, 내가 왜 금연을 시작했는지 다시 떠올리게 합니다.',
    },
  ],
  habit: [
    {
      title: '흡연 충동이 들 때마다 양치질하기',
      description: '식후나 기상 직후처럼 자동적으로 담배를 찾는 상황에서 입안 환경을 바꾸어 습관 연결고리를 끊습니다.',
    },
    {
      title: '담배를 제안받았을 때 할 말을 소리 내어 말하기',
      description: '누군가 담배를 피우러 가자고 했을 때 바로 대답할 문장을 미리 연습하여 행동 지침을 만들어 둡니다.',
      examples: ['아니, 나 지금 금연 중이라 안 피울게.', '나는 지금 참고 있는 중이라 같이 안 갈게.'],
    },
  ],
};

export const journalCopingOptions = Object.values(copingActionsBySmokingType)
  .flat()
  .map((action) => action.title);
