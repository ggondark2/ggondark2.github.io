---
name: 꼰닭 스튜디오 (ggondark studio)
description: 따뜻한 램프로 계란판을 비추는 앱 게임 스튜디오 홈페이지
colors:
  amber: "#ffb347"
  amber-ink: "#2b1606"
  stamp: "#c2272d"
  stamp-hi: "#ff6a5c"
  room: "#160f0a"
  room-2: "#20160e"
  pulp: "#a99f8e"
  pulp-d: "#7d7364"
  text: "#f6efe4"
  text-dim: "#d9cdbb"
  crack-ink: "#3a2410"
  embryo-ink: "#5a1d05"
typography:
  display:
    fontFamily: "Do Hyeon, Pretendard, sans-serif"
    fontSize: "clamp(56px, 8.4vw, 150px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Do Hyeon, Pretendard, sans-serif"
    fontSize: "clamp(56px, 8vw, 128px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  stage:
    fontFamily: "Do Hyeon, Pretendard, sans-serif"
    fontSize: "clamp(34px, 4.6vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
  title:
    fontFamily: "Do Hyeon, Pretendard, sans-serif"
    fontSize: "clamp(24px, 2vw, 32px)"
    fontWeight: 400
    lineHeight: 1.1
  lead:
    fontFamily: "Pretendard, system-ui, -apple-system, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(16px, 1.5vw, 22px)"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Pretendard, system-ui, -apple-system, Apple SD Gothic Neo, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.8
  button:
    fontFamily: "Pretendard, system-ui, -apple-system, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(15px, 1.2vw, 18px)"
    fontWeight: 800
    lineHeight: 1
  stamp:
    fontFamily: "Nanum Gothic Coding, monospace"
    fontSize: "clamp(12px, 1vw, 15px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  stamp: "4px"
  tag: "8px"
  store: "10px"
  pill: "999px"
  egg: "50%"
spacing:
  gut: "clamp(16px, 3vw, 44px)"
  section-y: "clamp(80px, 14vh, 160px)"
  works-gap: "clamp(28px, 4vh, 44px)"
components:
  button-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "1em 1.4em"
  button-amber-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.amber-ink}"
  button-ink:
    backgroundColor: "{colors.amber-ink}"
    textColor: "{colors.amber}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "1em 1.3em"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.amber-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "1em 1.3em"
  button-line-hover:
    backgroundColor: "{colors.amber-ink}"
    textColor: "{colors.amber}"
  stamp:
    textColor: "{colors.stamp-hi}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.5em 0.7em"
  store-badge:
    backgroundColor: "{colors.text}"
    textColor: "{colors.room}"
    rounded: "{rounded.store}"
    padding: "10px 14px"
  store-badge-hover:
    backgroundColor: "{colors.amber}"
  kind-chip:
    backgroundColor: "rgba(246,239,228,.08)"
    textColor: "{colors.text-dim}"
    rounded: "{rounded.pill}"
    padding: "7px 11px"
  lamp-tag:
    backgroundColor: "rgba(22,15,10,.88)"
    textColor: "{colors.text}"
    rounded: "{rounded.tag}"
    padding: ".7em .9em"
  lang-toggle-active:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.pill}"
    padding: "7px 10px"
---

# Design System: 꼰닭 스튜디오

## Overview

**Creative North Star: "부화실의 따뜻한 램프"**

불 꺼진 부화실에서 호박색 램프 하나가 펄프 계란판을 훑는다. 빛이 닿은 알만 속을 드러내고, 나머지는 어둠과 펄프 결 속에 가라앉는다. 사이트 전체가 이 하나의 장면에서 나온다. 바탕은 짙은 갈색 방(`room`), 재질은 실사 사진 판(계란판, 알, 껍데기, 병아리), 빛은 호박색(`amber`), 표식은 붉은 난각 도장(`stamp`)이다.

밀도는 낮고 글은 짧다. 정체성은 큰 Do Hyeon 제목, 사진 재질, 그리고 스크롤과 커서에 반응하는 모션이 맡는다. 아직 부화하지 않은 작품은 알로, 출시된 작품은 병아리와 스토어 링크로 보여 준다. 상태가 곧 그림이다.

**Key Characteristics:**
- 어둑한 방 + 램프 한 점의 빛. 밝음은 램프가 허락한 곳에만 있다.
- 재질은 생성한 실사 사진 판으로 표현하고, CSS는 빛과 마스크만 다룬다.
- 붉은 난각 도장(Nanum Gothic Coding + `#ink` 번짐 필터)이 유일한 코드성 글자다.
- 버튼과 칩은 알처럼 둥근 알약형(999px).
- 모든 상태 변화는 GSAP 타임라인 연출로 보여 준다.

## Colors

어두운 갈색 방, 회갈색 펄프, 한 가지 호박색 빛, 한 가지 붉은 도장색으로 이루어진 따뜻한 저채도 팔레트.

### Primary
- **램프 호박** (`amber`): 램프 빛 그 자체. 주 버튼, 언어 토글 선택, 포커스 링(3px), 메뉴 밑줄, 상태 문구, 문의 구역 전체 바탕. 빛이 아닌 곳에 쓰지 않는다.
- **호박 속 그을음** (`amber-ink`): 호박 바탕 위의 글자와 잉크 버튼. 호박과 짝으로만 쓴다.

### Secondary
- **난각 도장 적색** (`stamp`): 알 껍데기 위에 찍힌 도장. `mix-blend-mode:multiply`로 껍데기 사진에 스며든다.
- **어둠 속 도장** (`stamp-hi`): 어두운 바탕 위 독립 도장(히어로 제목 옆 코드). 어두운 바탕에서 읽히도록 밝힌 같은 계열.

### Neutral
- **부화실** (`room`): 페이지 바탕, 상단바 반투명(rgba(22,15,10,.86)), 램프 밖 어둠(.9).
- **부화실 안쪽** (`room-2`): 작품 구역 바탕. 방보다 한 단계 밝다.
- **펄프 판** (`pulp`): 히어로 바탕색. 그 위에 펄프 결 노이즈(opacity .55, multiply)가 깔린다.
- **젖은 펄프** (`pulp-d`): 스크롤바 손잡이.
- **달걀 흰빛** (`text`): 본문 강조 글자, 스토어 배지 바탕.
- **바랜 흰빛** (`text-dim`): 보조 문구, 메뉴 기본, 문서 본문.
- **균열 먹** (`crack-ink`): 알에 그어지는 SVG 균열선(stroke 2.4~4px, round).
- **배아 그림자** (`embryo-ink`): 램프에 비친 알 속 아이콘 실루엣(multiply, blur).

### Named Rules
**The One Lamp Rule.** 호박색은 빛이다. 버튼, 포커스, 선택, 문의 구역처럼 "불이 켜진" 자리에만 쓰고, 장식 면이나 테두리 색으로 흩뿌리지 않는다.

**The Stamp Ink Rule.** 붉은색은 난각 도장에만 쓴다. 도장은 항상 `#ink` 번짐 필터를 거친다.

## Typography

**Display Font:** Do Hyeon (with Pretendard, sans-serif)
**Body Font:** Pretendard (with system-ui, Apple SD Gothic Neo)
**Label/Mono Font:** Nanum Gothic Coding 700 (with monospace)

**Character:** 굵고 둥근 Do Hyeon이 큰 목소리를 내고, Pretendard가 짧은 설명을 받친다. 고정폭 Nanum Gothic Coding은 난각 도장과 온도, 상태 코드에만 쓴다.

### Hierarchy
- **Display** (`display`): 히어로 "꼰닭 스튜디오" 한 곳. 글자 단위로 올라오는 등장 연출.
- **Headline** (`headline`): 작품, 문의 구역 제목. 문의 메일 주소도 같은 서체(clamp(34px,6.4vw,104px)).
- **Stage** (`stage`): 부화 단계 세 줄. 진행 전 rgba(246,239,228,.4), 진행 후 `text`.
- **Title** (`title`): 작품 이름, 문서 h2(호박색).
- **Lead** (`lead`): 히어로 한 줄 소개, 단계 설명, 문의 안내. 최대 32~34em.
- **Body** (`body`): 개인정보처리방침 같은 읽는 문서. 본문 폭 760px.
- **Button** (`button`): 알약 버튼 라벨. 800 굵기.
- **Stamp** (`stamp`): 난각 도장, 온도(37.5°C), 작품 상태, 램프 태그 코드. letter-spacing .06~.08em.

### Named Rules
**The Shell Code Rule.** 고정폭 서체는 알에 찍히는 코드(개업일 + GGD + 칸 번호)와 상태 수치에만 쓴다. 섹션 머리말이나 설명 라벨로 쓰지 않는다.

**The Keep-All Rule.** 한국어 줄바꿈은 `word-break:keep-all`. 큰 제목은 `white-space:nowrap`으로 한 줄을 지킨다.

## Layout

전체 화면 장면을 세로로 잇는 구성. 좌우 여백은 `gut` 하나로 통일하고, 일반 구역 위아래는 `section-y`.

- **히어로:** 100svh(최소 640px). 계란판은 오른쪽 화면 밖까지 이어지며 -11도 기울어진다(폭 min(80vw,1200px), right -6vw). 글은 왼쪽 아래(bottom = gut × 1.4).
- **부화 구간:** 100svh 고정(pin) 후 화면 높이 2.6배 스크롤. 데스크톱 2열(1fr / 1.1fr), 모바일 1열.
- **작품:** 자동 채움 그리드(minmax(min(46%,240px),1fr)), 최대 1200px, 열 간격 0으로 계란판 칸처럼 붙는다. 모바일 2열.
- **문서:** 760px 단일 열, 위 여백 clamp(110px,16vh,150px).
- **브레이크포인트:** 860px 하나. 이하에서 메뉴는 "문의"만 남기고, 계란판은 160vw로 커져 위쪽(top 36%)으로 올라간다.

## Elevation & Depth

깊이는 그림자보다 빛과 어둠으로 만든다. 램프 반경 밖은 방 색(.9)으로 덮이고, 그 위에 screen 합성의 호박 빛무리가 얹힌다. 그림자는 사진 물체가 바닥에 놓였다는 느낌을 주는 부드러운 낙하 그림자뿐이다.

### Shadow Vocabulary
- **계란판 낙하** (`0 50px 90px rgba(10,6,3,.55)`): 히어로 계란판.
- **작품 칸 낙하** (`0 26px 36px -18px rgba(0,0,0,.6)`): 작품 타일.
- **램프 빛** (`0 10px 30px rgba(255,140,40,.25)`): 호박 버튼. 빛을 내는 물체라서 생기는 번짐.
- **알 발광** (`0 0 calc(var(--lit)*60px) calc(var(--lit)*10px) rgba(255,140,40,.45)`): 램프에 비친 알. 비춤 정도(`--lit`)에 비례.
- **제목 가독** (`text-shadow: 0 6px 40px rgba(0,0,0,.4)`): 펄프 위 히어로 제목.

### Named Rules
**The Lamp-Earned Glow Rule.** 빛번짐은 램프나 부화열(`--heat`)처럼 실제 광원이 있는 곳에만 둔다. 광원 없는 glow와 장식 그라데이션은 쓰지 않는다.

## Shapes

알에서 나온 둥근 형태 언어. 알과 램프 고리는 원(50%), 버튼과 칩, 언어 토글은 알약(999px), 정보 상자(램프 태그, 건너뛰기 링크)는 8px, 스토어 배지는 10px, 도장은 4px 각진 사각 테두리(2px). 앱 아이콘은 22% 둥근 사각. 직선 요소는 균열선과 링크 밑줄처럼 의미 있는 자리에만 있다.

## Components

### Buttons
알약형, 굵은 라벨, 오른쪽에 SVG 아이콘.
- **Shape:** 완전한 알약(999px).
- **Primary (`button-amber`):** 호박 바탕에 그을음 글자, 램프 빛 그림자. 호버 시 흰색으로 밝아지고 2px 떠오르며 화살표가 3px 앞으로.
- **Ink (`button-ink`):** 호박 구역 위 주 버튼. 호버 시 #000, 2px 상승.
- **Line (`button-line`):** inset 2px 그을음 테두리. 호버 시 잉크 버튼으로 채워진다.
- **Focus:** 전역 3px 호박 outline, offset 3px.
- **전환:** 색 .25s, 이동 .35s `ease-out`.

### Chips
- **Kind chip:** 반투명 흰빛(.08) 알약, `text-dim` 글자, 16px 아이콘(게임/앱).
- **Status:** 고정폭 호박 글자 + 흔들리는 작은 알 아이콘. 출시 상태는 녹색(#8fe3a4)에 흔들림 없음.

### Navigation
- 고정 상단바. 스크롤하면 `room` .86 + blur(10px)로 굳는다.
- 메뉴는 Pretendard 700, `text-dim`. 호버 시 `text`와 2px 호박 밑줄이 왼쪽에서 펼쳐진다(.35s).
- 언어 토글: 1.5px 반투명 테두리 알약 안의 KO/EN, 선택은 호박 채움.
- 860px 이하: "문의"와 언어 토글만.

### Stamp (난각 도장)
알 위에 찍힌 코드(예: "1102 GGD 09"). 독립형은 2px 테두리 4px 모서리, `stamp-hi`. 알 위에서는 테두리 없이 `stamp` + multiply, 칸마다 약간 회전. 등장은 scale 2.4→1, .35s `power4.in`(도장을 내리찍는 동작).

### Lamp (따뜻한 램프)
커서를 따라가는 빛(follow .09). 투명 반경 90px, 어둠 반경 330px. 150px 고리(2px rgba(255,190,110,.55))가 커서를 대신한다. 켜질 때 네 번 깜빡인 뒤 .6s로 안정. 2.2초 멈추면 작품 알을 3.2초씩 순서대로 비춘다. 램프 안쪽은 같은 구도의 따뜻한 조명 사진(`tray-warm.webp`)을 마스크로 드러내고, 작품 알 위에는 태그(코드 + 이름)가 뜬다. 알 속을 들여다보는 표현(핏줄, 붉은 투과광, 속 그림자)은 쓰지 않는다.

### Tray Tile (작품 칸)
계란판 사진의 한 칸을 잘라 쓴 타일(`--tile-pos`, `--tile-size`). 호버나 포커스 시 같은 칸의 따뜻한 조명 사진이 원형 마스크로 켜지고(.6s) 칸이 살짝 흔들리며, 도장은 옅어진다. 출시작은 병아리 + 아랫껍데기 + 앱 아이콘 + 스토어 배지. 다음 자리는 빈 칸과 흐린 제목. 등장은 ±6도 기울어진 채 60px 아래에서 1s `expo.out`, .1s 간격.

### Hatch Sequence (부화 연출)
스크롤 진행도에 묶인 타임라인: 따뜻한 빛(알 겉면이 꿀빛으로 밝아짐) → 흔들림 → 균열선 그리기 → 파열 VFX → 병아리 등장(squash 후 `back.out(3)`) → 껍데기 퇴장. 파열은 코어 섬광, 충격 고리, 실제 껍데기 사진을 오린 파편, 병아리 사진에서 뜬 솜털, 바닥 먼지 다섯 층이며 고정 시드로 되감아도 같은 모양이다.

## Do's and Don'ts

### Do:
- **Do** 재질(계란판, 알, 껍데기, 병아리, 펄프 칸)은 `codex-imagegen` 실사 사진 판으로 만들고, 레이어별로 나눠 `assets/img/PROMPTS.md`와 `*.webp.json`에 출처를 남긴다.
- **Do** 빛 상태가 다른 장면은 같은 구도의 짝 사진(`tray.webp` / `tray-warm.webp`)을 만들어 마스크로 전환한다.
- **Do** 조정 가능한 연출 값(램프 반경, 속도, 등장 시점, 들썩임 간격, 파편 수, 계란판 칸 좌표와 기울기)은 `assets/js/config.js`의 `SITE_CONFIG`에 한글 주석과 함께 둔다.
- **Do** 화면 문구는 `data/i18n/{ko,en}.json` 키와 `data-i18n`, `data-i18n-attr`로 넣고, 작품 정보는 `data/works.json`(version 필드 포함)에서만 읽는다.
- **Do** 누락된 데이터, 번역, 이미지는 콘솔 오류나 throw로 드러낸다.
- **Do** 등장은 `expo.out`, 도장은 `power4.in`, 스크롤 연동은 `ease:'none'`으로 쓰고, `prefers-reduced-motion`에서는 애니메이션과 전환을 끈다.
- **Do** 아이콘은 index.html의 SVG `<symbol>`을 `<use>`로 쓴다.

### Don't:
- **Don't** 계란판, 알, 펄프 같은 물체를 CSS 도형이나 그라데이션으로 그리지 않는다. CSS는 빛, 마스크, 노이즈 결만 맡는다.
- **Don't** 광원 없는 glow, 장식 그라데이션, 장식용 직선과 구분선을 넣지 않는다.
- **Don't** 이모지나 글리프 문자를 아이콘으로 쓰지 않는다.
- **Don't** 고정폭 도장 서체로 섹션 머리말이나 작은 라벨 줄을 만들지 않는다.
- **Don't** 누락을 기본값이나 다른 언어로 조용히 대체하지 않는다.
- **Don't** 출시작, 다운로드 수, 리뷰처럼 없는 실적을 그림이나 숫자로 지어내지 않는다.
