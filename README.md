# 꼰닭 스튜디오 홈페이지

https://ggondark2.github.io/

정적 HTML/CSS/JS, GitHub Pages 사용자 사이트(`main` 브랜치 루트 배포). 빌드 도구 없음.

## 주소를 이렇게 정한 이유

- Google Play Console 개발자 웹사이트: `https://ggondark2.github.io/`
- 개인정보처리방침 URL: `https://ggondark2.github.io/privacy/`
- AdMob `app-ads.txt` 는 개발자 웹사이트 **도메인 루트**에 있어야 크롤링된다. 그래서 프로젝트 사이트(`/ggondark-studio/`)가 아니라 사용자 사이트 레포 이름(`ggondark2.github.io`)을 쓴다.

## 자주 하는 일

### 작품 추가·출시

`data/works.json` 의 `works` 배열을 고친다.

| 필드 | 값 |
|---|---|
| `id` | 고유 이름 (영문) |
| `code` | 알에 비칠 코드 (예: `PROJECT 01`) |
| `kind` | `game` 또는 `app` |
| `status` | `incubating`(부화 중) 또는 `hatched`(출시) |
| `name`, `summary` | `{ "ko": "...", "en": "..." }` |
| `icon` | 출시 후 앱 아이콘 경로 (예: `assets/img/works/my-app.png`), 없으면 `null` |
| `stores` | `{ "googlePlay": "https://play.google.com/...", "appStore": "https://apps.apple.com/..." }` 출시 작품은 하나 이상 필수 |
| `privacy` | 앱 전용 개인정보처리방침 경로 (예: `privacy/my-app/`), 없으면 `null` |

형식이 틀린 항목은 화면에 나오지 않고 브라우저 콘솔에 `[works]` 오류가 찍힌다.

### 앱별 개인정보처리방침

광고(AdMob), 분석(Firebase), 결제 등을 쓰는 앱은 `privacy/<앱id>/index.html` 을 `privacy/index.html` 형식으로 만들고 수집 항목을 구체적으로 적은 뒤, `works.json` 의 `privacy` 에 경로를 넣는다. Play Console 에는 그 주소를 등록한다.

### AdMob app-ads.txt

AdMob 계정이 생기면 레포 루트에 `app-ads.txt` 를 만든다.

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

### 문구·연출 값

- 문구(한국어/영어/일본어/대만 번체): `data/i18n/<언어>.json`. 한국어는 `index.html` 본문에도 들어 있다.
- 연출·배치 값(계란판 칸 수, 램프 반경, 등장 타이밍, 부화 스크롤 길이 등): `assets/js/config.js` (한글 주석 참고).
- 새 언어: `config.js` 의 `languages`, `langMatch`, `langFonts` 에 추가하고 `data/i18n/<언어>.json` 을 만든다. `data/works.json` 의 이름과 소개, `privacy/index.html` 의 본문과 표시 규칙, 언어 토글, `site.css` 의 글꼴 규칙도 함께 추가한다.

### 배포 후 캐시

CSS/JS 를 바꾸면 HTML 의 `?v=` 값을 함께 올린다.

## 로컬 확인

```bash
python -m http.server 5173
```

http://localhost:5173/
