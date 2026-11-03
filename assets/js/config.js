// 사이트 조정값. 연출, 배치, 문구 값은 여기서만 바꾼다.
window.SITE_CONFIG = {
  // 스튜디오 기본 정보
  studio: {
    email: 'ggondark2@gmail.com',      // 문의 메일 (화면 표시와 mailto 모두 사용)
    founded: '1102',                   // 난각 도장 앞자리 (개업일 11월 2일)
    stampPrefix: 'GGD',                // 난각 도장 가운데 글자
  },

  // 지원 언어. 첫 번째가 기본 언어이고 HTML 본문도 이 언어로 쓰여 있다.
  languages: ['ko', 'en'],

  // 첫 화면 계란판
  tray: {
    cols: 6,                // 가로 칸 수
    rows: 4,                // 세로 칸 수
    emptySlots: [20, 23],   // 알을 두지 않는 칸 번호 (0부터, 왼쪽 위에서 오른쪽으로)
    brownEvery: 5,          // 몇 번째마다 갈색 알을 둘지 (칸 번호 * 7 을 이 값으로 나눈 나머지가 0이면 갈색)
    keySlots: [8, 15, 3],   // 작품 알을 둘 칸. works.json 의 부화 중 작품이 순서대로 들어간다
    tiltDeg: -11,           // 계란판 기울기
  },

  // 검란 램프
  lamp: {
    clearRadius: 90,        // 완전히 밝은 반경 (px)
    fadeRadius: 330,        // 어둠으로 바뀌는 바깥 반경 (px)
    follow: 0.09,           // 커서를 따라가는 속도 (0~1, 클수록 빠름)
    litReach: 1.05,         // 알 너비 대비 비춰지는 거리
    idleSeconds: 2.2,       // 이 시간 동안 움직임이 없으면 스스로 작품 알을 순서대로 비춘다
    tourSeconds: 3.2,       // 작품 알 하나를 비추는 시간
  },

  // 등장 연출 타이밍 (초)
  intro: {
    eggDropStagger: 0.035,  // 알이 하나씩 놓이는 간격
    lampOnAt: 1.2,          // 램프가 깜빡이며 켜지는 시점
    textAt: 1.55,           // 제목이 올라오는 시점
  },

  // 작품 알 들썩임
  wobble: {
    firstDelay: 3,          // 첫 들썩임까지
    repeatDelay: 2.4,       // 들썩임 사이 간격 (알마다 1.3초씩 더해짐)
  },

  // 부화 연출 (스크롤)
  hatch: {
    scrollLength: 2.6,      // 부화 구간 길이 (화면 높이 배수)
    shards: 26,             // 껍데기 파편 수
    fluff: 40,              // 솜털 입자 수
  },
};
