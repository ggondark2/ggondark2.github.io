// 첫 화면: 실사 계란판과 검란 램프
window.Hero = (() => {
  const C = window.SITE_CONFIG;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hero, tray, lit, dark, glow, ring, tag, spots = [], keys = [];
  let lx = 0, ly = 0, tx = 0, ty = 0, idle = 0, tour = 0, power = 0, running = false, finePointer = false;
  let inv = null, fwd = null, box = { l: 0, t: 0, w: 1, h: 1 };

  const stampText = n => `${C.studio.founded} ${C.studio.stampPrefix} ${String(n).padStart(2, '0')}`;

  // 칸 번호 → 판 안의 위치(%)
  function cell(i) {
    const T = C.tray, c = i % T.cols, r = Math.floor(i / T.cols);
    return { x: T.colX[c] / T.plateW * 100, y: T.rowY[r] / T.plateH * 100, d: T.eggR * 2 / T.plateW * 100 };
  }

  function buildTray(works) {
    const T = C.tray;
    tray = document.getElementById('tray');
    tray.style.setProperty('--tilt', T.tiltDeg + 'deg');
    tray.style.aspectRatio = `${T.plateW}/${T.plateH}`;
    // CSS 변수 안의 url() 은 스타일시트 기준으로 풀리므로 절대 주소로 넘긴다
    tray.style.setProperty('--plate', `url(${new URL(T.plate, I18N.root).href})`);
    tray.style.setProperty('--lit-plate', `url(${new URL(T.litPlate, I18N.root).href})`);
    lit = tray.querySelector('.plate-lit');
    const keyed = {};
    works.filter(w => w.status === 'incubating').slice(0, T.keySlots.length).forEach((w, i) => { keyed[T.keySlots[i]] = w; });
    for (let i = 0; i < T.cols * T.rows; i++) {
      if (T.empty.includes(i)) continue;
      const p = cell(i), w = keyed[i], el = document.createElement('div');
      el.className = 'spot' + (w ? ' key' : '');
      el.style.cssText = `left:${p.x - p.d / 2}%;top:${p.y}%;margin-top:${-p.d / 2}%;width:${p.d}%;--rot:${((i * 37) % 23) - 11}deg`;
      el.dataset.cx = p.x; el.dataset.cy = p.y;
      if (w) {
        // 작품 알은 판에서 그 알만 떠 와 따로 움직인다
        const bx = 100 / p.d * 100, cx = (T.colX[i % T.cols] - T.eggR) / (T.plateW - T.eggR * 2) * 100, cy = (T.rowY[Math.floor(i / T.cols)] - T.eggR) / (T.plateH - T.eggR * 2) * 100;
        el.style.setProperty('--bg-size', `${bx}% auto`); el.style.setProperty('--bg-pos', `${cx}% ${cy}%`);
        el.innerHTML = `<div class="shell"></div><div class="shell lit"></div>` +
          `<svg class="crack" viewBox="0 0 100 100"><path d="M10 52 L22 44 L30 56 L42 42 L52 56 L62 42 L72 54 L90 46"/></svg>`;
        el.work = w; el.tabIndex = -1;
      }
      el.insertAdjacentHTML('beforeend', `<span class="egg-stamp">${stampText(i + 1)}</span>`);
      tray.appendChild(el);
    }
    spots = [...tray.querySelectorAll('.spot')];
    keys = spots.filter(s => s.work);
  }

  // 판은 회전돼 있으므로 행렬로 화면 좌표와 판 좌표를 오간다
  function measure() {
    box = { l: tray.offsetLeft, t: tray.offsetTop, w: tray.offsetWidth, h: tray.offsetHeight };
    fwd = new DOMMatrix(getComputedStyle(tray).transform);
    inv = fwd.inverse();
    spots.forEach(s => {
      const lxp = s.dataset.cx / 100 * box.w - box.w / 2, lyp = s.dataset.cy / 100 * box.h - box.h / 2;
      const q = fwd.transformPoint(new DOMPoint(lxp, lyp));
      s.cx = q.x + box.l + box.w / 2; s.cy = q.y + box.t + box.h / 2; s.w = parseFloat(s.style.width) / 100 * box.w;
    });
  }
  function toLocal(px, py) {
    const q = inv.transformPoint(new DOMPoint(px - box.l - box.w / 2, py - box.t - box.h / 2));
    return [q.x + box.w / 2, q.y + box.h / 2];
  }

  function tick() {
    if (!running) return;
    const L = C.lamp;
    idle += 1 / 60;
    if ((idle > L.idleSeconds || !finePointer) && keys.length) {
      tour += 1 / 60;
      const k = keys[Math.floor(tour / L.tourSeconds) % keys.length];
      tx = k.cx + Math.sin(tour * 1.3) * 18; ty = k.cy + Math.cos(tour * 1.1) * 14;
    }
    lx += (tx - lx) * L.follow; ly += (ty - ly) * L.follow;
    const r0 = L.clearRadius * power, r1 = r0 + (L.fadeRadius - L.clearRadius) * power + 20;
    for (const el of [dark, glow]) { el.style.setProperty('--lx', lx + 'px'); el.style.setProperty('--ly', ly + 'px'); }
    dark.style.setProperty('--r0', r0 + 'px'); dark.style.setProperty('--r1', r1 + 'px');
    glow.style.setProperty('--pw', power.toFixed(3));
    ring.style.transform = `translate(${lx}px,${ly}px)`;
    // 검란 사진은 램프 안쪽만 보인다 (판 좌표로 바꿔 마스크)
    const [mx, my] = toLocal(lx, ly);
    tray.style.setProperty('--mx', mx + 'px'); tray.style.setProperty('--my', my + 'px');
    tray.style.setProperty('--mr0', r0 * 1.1 + 'px'); tray.style.setProperty('--mr1', r0 * 1.1 + 200 * power + 1 + 'px');
    let best = null, bestD = 1e9;
    spots.forEach(s => {
      const d = Math.hypot(s.cx - lx, s.cy - ly);
      s.style.setProperty('--lit', (Math.max(0, 1 - d / (s.w * L.litReach)) * power).toFixed(3));
      if (s.work && d < bestD) { bestD = d; best = s; }
    });
    if (best && bestD < best.w * .7 && power > .5) {
      tag.firstChild.textContent = best.work.code;
      tag.lastChild.textContent = best.work.name[I18N.lang] + ' ' + I18N.t('status.incubating');
      tag.style.left = (best.cx + best.w * .55) + 'px'; tag.style.top = best.cy + 'px'; tag.style.opacity = 1;
    } else tag.style.opacity = 0;
    requestAnimationFrame(tick);
  }

  function splitTitle() {
    const t = hero.querySelector('.hero-title .t');
    t.innerHTML = [...t.textContent].map(ch => ch === ' ' ? ' ' : `<span class="ch">${ch}</span>`).join('');
  }

  function intro() {
    const I = C.intro, p = { v: 0 }, set = () => { power = p.v; };
    const tl = gsap.timeline({ delay: .2 });
    tl.from(tray, { opacity: 0, scale: 1.08, duration: 1.4, ease: 'expo.out' })
      .from('.tray .egg-stamp', { scale: 2.4, opacity: 0, duration: .35, ease: 'power4.in', stagger: { each: I.stampStagger, from: 'random' } }, .5)
      .to(p, { v: .6, duration: .08, onUpdate: set }, I.lampOnAt).to(p, { v: .1, duration: .1, onUpdate: set })
      .to(p, { v: .85, duration: .08, onUpdate: set }).to(p, { v: .3, duration: .12, onUpdate: set })
      .to(p, { v: 1, duration: .6, ease: 'power2.out', onUpdate: set })
      .from('.hero-title .ch', { yPercent: 120, opacity: 0, stagger: .06, duration: .9, ease: 'expo.out' }, I.textAt)
      .from('#hero-stamp', { scale: 2.6, opacity: 0, rotate: -30, duration: .45, ease: 'power4.in' }, I.textAt + .7)
      .from('.hero-lead, .hero-actions', { y: 24, opacity: 0, stagger: .1, duration: .8, ease: 'expo.out' }, I.textAt + .4)
      .from('.site-top > *', { y: -20, opacity: 0, stagger: .1, duration: .8, ease: 'expo.out' }, I.textAt + .2);
    if (reduce) { tl.progress(1); power = 1; }
  }

  function wobble() {
    keys.forEach((el, i) => {
      const path = el.querySelector('.crack path'), len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      if (!reduce) gsap.timeline({ repeat: -1, repeatDelay: C.wobble.repeatDelay + i * 1.3, delay: C.wobble.firstDelay + i })
        .to(el, { rotate: '+=8', duration: .07, yoyo: true, repeat: 5, ease: 'sine.inOut' })
        .to(el, { scale: 1.04, duration: .12, yoyo: true, repeat: 1 }, '<');
      el.addEventListener('click', () => {
        gsap.timeline().to(el, { scale: 1.08, duration: .08, yoyo: true, repeat: 3 })
          .to(path, { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, 0)
          .to(path, { strokeDashoffset: len, duration: .6, delay: 1.4 });
        setTimeout(() => document.getElementById('works').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 700);
      });
    });
  }

  function init(works) {
    hero = document.getElementById('top'); dark = document.getElementById('dark'); glow = document.getElementById('glow');
    ring = document.getElementById('ring'); tag = document.getElementById('tag');
    document.getElementById('hero-stamp').textContent = stampText(1);
    buildTray(works);
    finePointer = matchMedia('(pointer: fine)').matches;
    hero.classList.toggle('lamp-cursor', finePointer);
    lx = tx = hero.clientWidth * .7; ly = ty = hero.clientHeight * .5;
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; idle = 0;
    });
    measure();
    addEventListener('resize', measure);
    new ResizeObserver(measure).observe(hero);
    new IntersectionObserver(([en]) => {
      const was = running; running = en.isIntersecting;
      if (running && !was) requestAnimationFrame(tick);
    }).observe(hero);
    splitTitle(); intro(); wobble();
    setTimeout(measure, 1800); // 판 등장 연출이 끝난 뒤 위치를 다시 잰다
  }
  return { init, cell };
})();
