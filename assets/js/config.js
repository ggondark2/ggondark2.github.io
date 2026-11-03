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

  // 첫 화면 계란판 (실사 판 이미지 위에 도장과 작품 알을 겹친다)
  tray: {
    plate: 'assets/img/tray.webp',          // 평소 계란판 사진
    litPlate: 'assets/img/tray-warm.webp',  // 같은 구도로 따뜻한 램프를 비춘 사진 (램프 안쪽에만 보인다)
    plateW: 1536, plateH: 1024,              // 판 이미지 원본 크기 (px)
    cols: 6, rows: 4,                        // 칸 수
    colX: [137, 389, 642, 895, 1147, 1400],  // 열별 알 중심 x (원본 px)
    rowY: [148, 407, 667, 912],              // 행별 알 중심 y (원본 px)
    eggR: 108,                               // 알 반지름 (원본 px)
    empty: [4, 20, 23],                      // 비어 있는 칸 번호 (0부터, 왼쪽 위에서 오른쪽으로)
    keySlots: [8, 15, 3],                    // 작품 알을 둘 칸. works.json 의 부화 중 작품이 순서대로 들어간다
    nextSlot: 4,                             // 작품 목록의 "다음 알" 자리로 보여 줄 빈 칸
    tiltDeg: -11,                            // 계란판 기울기
  },

  // 작품 목록 계란판 줄
  worksStrip: {
    tileMax: 330,           // 칸 하나의 최대 너비 (px)
    maxCols: 5,             // 데스크톱 한 줄 최대 칸 수
    maxColsMobile: 3,       // 모바일 한 줄 최대 칸 수
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
    stampStagger: 0.04,     // 난각 도장이 하나씩 찍히는 간격
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
    dust: 14,               // 바닥 먼지 덩이 수
    shellSlide: 52,         // 부화 후 아래 껍데기가 옆으로 비켜나는 거리 (껍데기 폭 대비 %, 데스크톱)
    shellSlideMobile: 22,   // 같은 값 (모바일)
  },
};
