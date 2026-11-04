// 다국어: data/i18n/<언어>.json 사전으로 [data-i18n] 글자와 [data-i18n-attr] 속성을 바꾼다.
// 사전에 없는 키는 콘솔 오류로 알리고 키 이름을 그대로 보여 준다 (조용히 넘어가지 않음).
window.I18N = (() => {
  const LANGS = window.SITE_CONFIG.languages;
  const ROOT = new URL('../../', document.currentScript.src).href;
  const dicts = {};
  const fontsLoaded = new Set();
  let lang = pick();

  function pick() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { /* 저장소 차단 시 브라우저 언어로 */ }
    if (LANGS.includes(saved)) return saved;
    for (const tag of navigator.languages || []) {
      const match = window.SITE_CONFIG.langMatch[tag.split('-')[0].toLowerCase()];
      if (match) return match;
    }
    return window.SITE_CONFIG.fallbackLang;
  }

  // 한중일 글꼴은 무거우므로 고른 언어의 글꼴만 불러온다
  function loadFont(l) {
    const href = window.SITE_CONFIG.langFonts[l];
    if (!href || fontsLoaded.has(href)) return;
    fontsLoaded.add(href);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onerror = () => console.error('[i18n] 글꼴을 불러오지 못함: ' + l);
    document.head.append(link);
  }

  async function load(l) {
    if (dicts[l]) return dicts[l];
    const res = await fetch(ROOT + 'data/i18n/' + l + '.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('[i18n] 사전을 불러오지 못함: ' + l + ' (' + res.status + ')');
    return (dicts[l] = await res.json());
  }

  function t(key) {
    const v = dicts[lang] && dicts[lang][key];
    if (v == null) { console.error('[i18n] 키 없음', lang, key); return key; }
    return v;
  }

  function applyDom() {
    loadFont(lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
    const titleKey = document.body.dataset.titleKey || 'meta.title';
    document.title = t(titleKey);
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  async function set(l) {
    if (!LANGS.includes(l)) throw new Error('[i18n] 지원하지 않는 언어: ' + l);
    await load(l);
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) { /* 저장 불가해도 이번 화면은 바뀐다 */ }
    applyDom();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b) set(b.dataset.lang);
  });

  const ready = load(lang).then(applyDom);
  return { get lang() { return lang; }, t, set, ready, root: ROOT };
})();
