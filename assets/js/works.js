// 작품 목록: data/works.json 을 읽어 그린다. 형식이 틀린 항목은 콘솔 오류를 남기고 그리지 않는다.
window.Works = (() => {
  const KINDS = ['game', 'app', 'secret'], STATUSES = ['incubating', 'hatched'];
  const STORE = { googlePlay: 'i-play', appStore: 'i-apple' };
  const ICON = { game: 'i-game', app: 'i-app', secret: 'i-chick' };
  let list = [];

  function valid(w, i) {
    const errs = [];
    if (!w.id) errs.push('id 없음');
    if (!KINDS.includes(w.kind)) errs.push('kind 는 ' + KINDS.join('/') + ' 중 하나');
    if (!STATUSES.includes(w.status)) errs.push('status 는 ' + STATUSES.join('/') + ' 중 하나');
    if (!w.name || typeof w.name !== 'object') errs.push('name 은 언어별 객체');
    if (w.status === 'hatched' && !Object.keys(w.stores || {}).length) errs.push('출시 작품은 stores 링크 필요');
    Object.keys(w.stores || {}).forEach(k => { if (!STORE[k]) errs.push('알 수 없는 스토어: ' + k); });
    if (errs.length) console.error('[works] ' + i + '번 항목 오류:', errs.join(', '), w);
    return !errs.length;
  }

  async function load() {
    const res = await fetch(I18N.root + 'data/works.json', { cache: 'no-cache' }); // 작품 갱신이 바로 보이도록 매번 재검증
    if (!res.ok) throw new Error('[works] works.json 을 불러오지 못함 (' + res.status + ')');
    const data = await res.json();
    if (data.version !== 1) throw new Error('[works] 지원하지 않는 버전: ' + data.version);
    list = data.works.filter(valid);
    return list;
  }

  function loc(obj) {
    const v = obj && obj[I18N.lang];
    if (v == null) { console.error('[works] 번역 없음', I18N.lang, obj); return ''; }
    return v;
  }

  // 계란판 사진에서 한 칸(알 하나와 그 둘레)을 잘라 낸 배경 값
  function crop(slot) {
    const T = SITE_CONFIG.tray, c = slot % T.cols, r = Math.floor(slot / T.cols);
    const sw = (T.colX[T.cols - 1] - T.colX[0]) / (T.cols - 1), sh = (T.rowY[T.rows - 1] - T.rowY[0]) / (T.rows - 1);
    const x0 = T.colX[c] - sw / 2, y0 = T.rowY[r] - sh / 2;
    return `--tile-size:${T.plateW / sw * 100}% auto;--tile-pos:${x0 / (T.plateW - sw) * 100}% ${y0 / (T.plateH - sh) * 100}%;aspect-ratio:${sw}/${sh}`;
  }

  function item(w, slot) {
    const t = I18N.t, stamp = `${SITE_CONFIG.studio.founded} ${SITE_CONFIG.studio.stampPrefix} ${String(slot + 1).padStart(2, '0')}`;
    const art = w.status === 'hatched'
      ? `<div class="work-hatched">${w.icon ? `<img class="app-icon" src="${w.icon}" alt="" loading="lazy">` : '<img class="chick" src="assets/img/chick.webp" alt="" loading="lazy">'}<img class="shell" src="assets/img/shell-bottom.webp" alt="" loading="lazy"></div>`
      : `<div class="tile-lit"></div><span class="egg-stamp">${stamp}</span>`;
    const stores = Object.entries(w.stores || {}).map(([k, url]) =>
      `<a class="store" href="${url}" target="_blank" rel="noopener"><svg class="ico"><use href="#${STORE[k]}"/></svg>${t('store.' + k)}</a>`).join('');
    return `<li class="work ${w.status}" tabindex="0">
      <div class="tile" style="${crop(slot)}">${art}</div>
      <h3>${loc(w.name)}</h3>
      <div class="work-meta">
        <span class="kind" title="${t('kind.' + w.kind)}"><svg class="ico"><use href="#${ICON[w.kind]}"/></svg><span class="lbl">${t('kind.' + w.kind)}</span></span>
        <span class="status ${w.status}"><svg class="mini-egg"><use href="#i-egg"/></svg>${t('status.' + w.status)}</span>
      </div>
      ${stores ? `<div class="stores">${stores}</div>` : ''}
      ${w.privacy ? `<div class="work-links"><a href="${w.privacy}">${t('works.privacy')}</a></div>` : ''}
    </li>`;
  }

  function render() {
    const T = SITE_CONFIG.tray, ul = document.getElementById('works-list');
    // CSS 변수 안의 url() 은 스타일시트 기준으로 풀리므로 절대 주소로 넘긴다
    ul.style.setProperty('--plate', `url(${new URL(T.plate, I18N.root).href})`);
    ul.style.setProperty('--lit-plate', `url(${new URL(T.litPlate, I18N.root).href})`);
    let k = 0;
    // 부화 중 작품은 첫 화면과 같은 알 칸, 출시 작품은 빈 칸(껍데기만 남은 자리)에 놓는다
    ul.innerHTML = list.map(w => item(w, w.status === 'incubating' ? T.keySlots[k++ % T.keySlots.length] : T.nextSlot)).join('') +
      `<li class="work next" aria-hidden="true"><div class="tile" style="${crop(T.nextSlot)}"></div><h3>${I18N.t('works.next')}</h3></li>`;
    fit();
  }

  // 칸 수만큼만 열을 만들어 판이 한 조각으로 이어지게 한다 (화면 폭별 최대 열 수는 config)
  function fit() {
    const ul = document.getElementById('works-list'), n = ul.children.length, W = SITE_CONFIG.worksStrip;
    const max = innerWidth < 860 ? W.maxColsMobile : W.maxCols;
    ul.style.gridTemplateColumns = `repeat(${Math.min(n, max)}, minmax(0, ${W.tileMax}px))`;
  }
  addEventListener('resize', () => { if (list.length) fit(); });

  function reveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('#works-title', { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#works', start: 'top 75%' } });
    // 판 조각이 차례로 맞물리고, 도장이 찍힌다
    gsap.fromTo('.work .tile', { y: 60, rotate: i => (i % 2 ? 6 : -6), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .1, clearProps: 'transform', scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
    gsap.fromTo('.work .egg-stamp', { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: 'power4.in', stagger: .1, delay: .6, clearProps: 'opacity,scale', scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
    gsap.from('.work h3, .work-meta, .stores', { y: 20, opacity: 0, duration: .8, ease: 'expo.out', stagger: .06, delay: .5, scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
  }

  document.addEventListener('langchange', () => { if (list.length) render(); });
  return { load, render, reveal };
})();
