// 작품 목록: data/works.json 을 읽어 그린다. 형식이 틀린 항목은 콘솔 오류를 남기고 그리지 않는다.
window.Works = (() => {
  const KINDS = ['game', 'app'], STATUSES = ['incubating', 'hatched'];
  const STORE = { googlePlay: 'i-play', appStore: 'i-apple' };
  const ICON = { game: 'i-game', app: 'i-app' };
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
    const res = await fetch(I18N.root + 'data/works.json');
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

  function item(w, n) {
    const t = I18N.t, stamp = `${SITE_CONFIG.studio.founded} ${SITE_CONFIG.studio.stampPrefix} ${String(n).padStart(2, '0')}`;
    const art = w.status === 'hatched'
      ? `<div class="work-hatched">${w.icon ? `<img class="app-icon" src="${w.icon}" alt="" loading="lazy">` : '<img class="chick" src="assets/img/chick.webp" alt="" loading="lazy">'}<img class="shell" src="assets/img/shell-bottom.webp" alt="" loading="lazy"></div>`
      : `<div class="work-egg"><div class="egg-body"><img src="assets/img/egg-whole.webp" alt="" loading="lazy"><div class="candle"></div><div class="inside"><svg><use href="#${ICON[w.kind]}"/></svg></div><span class="egg-stamp">${stamp}</span></div></div>`;
    const stores = Object.entries(w.stores || {}).map(([k, url]) =>
      `<a class="store" href="${url}" target="_blank" rel="noopener"><svg class="ico"><use href="#${STORE[k]}"/></svg>${t('store.' + k)}</a>`).join('');
    return `<li class="work" tabindex="0">
      <div class="work-pit">${art}</div>
      <h3>${loc(w.name)}</h3>
      <div class="work-meta">
        <span class="kind"><svg class="ico"><use href="#${ICON[w.kind]}"/></svg>${t('kind.' + w.kind)}</span>
        <span class="status ${w.status}"><svg class="mini-egg"><use href="#i-egg"/></svg>${t('status.' + w.status)}</span>
      </div>
      ${stores ? `<div class="stores">${stores}</div>` : ''}
      ${w.privacy ? `<div class="work-links"><a href="${w.privacy}">${t('works.privacy')}</a></div>` : ''}
    </li>`;
  }

  function render() {
    const ul = document.getElementById('works-list');
    ul.innerHTML = list.map((w, i) => item(w, i + 1)).join('') +
      `<li class="work next" aria-hidden="true"><div class="work-pit"></div><h3>${I18N.t('works.next')}</h3></li>`;
  }

  function reveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('#works-title', { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#works', start: 'top 75%' } });
    gsap.from('.work .work-pit', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(1.6)', stagger: .12, scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
    gsap.fromTo('.work-egg, .work-hatched', { y: -140, rotate: -25, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', stagger: .12, delay: .25, clearProps: 'transform', scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
    gsap.from('.work h3, .work-meta, .stores', { y: 20, opacity: 0, duration: .8, ease: 'expo.out', stagger: .06, delay: .5, scrollTrigger: { trigger: '#works-list', start: 'top 80%' } });
  }

  document.addEventListener('langchange', () => { if (list.length) render(); });
  return { load, render, reveal };
})();
