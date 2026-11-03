// 첫 화면: 계란판과 검란 램프
window.Hero = (() => {
  const C = window.SITE_CONFIG;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = { game: 'i-game', app: 'i-app' };
  let hero, dark, glow, ring, tag, eggs = [], keyEggs = [], centers = [];
  let lx = 0, ly = 0, tx = 0, ty = 0, idle = 0, tour = 0, power = 0, running = false, finePointer = false;

  function stampText(n) { return `${C.studio.founded} ${C.studio.stampPrefix} ${String(n).padStart(2, '0')}`; }

  function buildTray(works) {
    const tray = document.getElementById('tray');
    const { cols, rows, emptySlots, brownEvery, keySlots, tiltDeg } = C.tray;
    tray.style.setProperty('--tilt', tiltDeg + 'deg');
    tray.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    tray.style.gridTemplateRows = `repeat(${rows},1fr)`;
    tray.style.aspectRatio = `${cols}/${rows * 1.05}`;
    const keyed = {};
    works.filter(w => w.status === 'incubating').slice(0, keySlots.length).forEach((w, i) => { keyed[keySlots[i]] = w; });
    for (let i = 0; i < cols * rows; i++) {
      const cup = document.createElement('div'); cup.className = 'cup';
      tray.appendChild(cup);
      if (emptySlots.includes(i)) continue;
      const w = keyed[i], egg = document.createElement('div');
      egg.className = 'egg' + ((i * 7) % brownEvery === 0 ? ' brown' : '') + (w ? ' key' : '');
      egg.innerHTML = '<div class="candle"></div>' +
        (w ? `<div class="inside"><svg><use href="#${ICON[w.kind]}"/></svg></div>` : '') +
        `<span class="egg-stamp">${stampText(i + 1)}</span>` +
        (w ? '<svg class="crack" viewBox="0 0 100 128"><path d="M14 58 L26 52 L32 62 L44 50 L52 60 L62 48 L70 58 L86 52"/></svg>' : '');
      egg.style.rotate = ((i * 37) % 17 - 8) + 'deg';
      if (w) egg.work = w;
      cup.appendChild(egg);
    }
    eggs = [...tray.querySelectorAll('.egg')];
    keyEggs = eggs.filter(e => e.work);
  }

  function measure() {
    const hr = hero.getBoundingClientRect();
    centers = eggs.map(el => { const b = el.getBoundingClientRect(); return { x: b.left - hr.left + b.width / 2, y: b.top - hr.top + b.height / 2, w: b.width, right: b.right - hr.left }; });
  }

  function tagText(w) { return [w.code, I18N.t('kind.' + w.kind) + ' ' + I18N.t('status.incubating')]; }

  function tick() {
    if (!running) return;
    const L = C.lamp;
    idle += 1 / 60;
    if ((idle > L.idleSeconds || !finePointer) && keyEggs.length) {
      tour += 1 / 60;
      const k = eggs.indexOf(keyEggs[Math.floor(tour / L.tourSeconds) % keyEggs.length]), c = centers[k];
      tx = c.x + Math.sin(tour * 1.3) * 18; ty = c.y + Math.cos(tour * 1.1) * 14;
    }
    lx += (tx - lx) * L.follow; ly += (ty - ly) * L.follow;
    const r0 = L.clearRadius * power, r1 = r0 + (L.fadeRadius - L.clearRadius) * power + 20;
    for (const el of [dark, glow]) { el.style.setProperty('--lx', lx + 'px'); el.style.setProperty('--ly', ly + 'px'); }
    dark.style.setProperty('--r0', r0 + 'px'); dark.style.setProperty('--r1', r1 + 'px');
    glow.style.setProperty('--pw', power.toFixed(3));
    ring.style.transform = `translate(${lx}px,${ly}px)`;
    let best = -1, bestD = 1e9;
    eggs.forEach((el, i) => {
      const c = centers[i], d = Math.hypot(c.x - lx, c.y - ly);
      el.style.setProperty('--lit', (Math.max(0, 1 - d / (c.w * L.litReach)) * power).toFixed(3));
      if (el.work && d < bestD) { bestD = d; best = i; }
    });
    if (best >= 0 && bestD < centers[best].w * .7 && power > .5) {
      const [code, label] = tagText(eggs[best].work);
      tag.firstChild.textContent = code; tag.lastChild.textContent = label;
      tag.style.left = centers[best].right + 'px'; tag.style.top = centers[best].y + 'px'; tag.style.opacity = 1;
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
    tl.from('.tray .cup', { opacity: 0, duration: .5, stagger: { each: .015, from: 'random' } })
      .from('.tray .egg', { scale: 1.5, y: -60, opacity: 0, duration: .7, ease: 'bounce.out', stagger: { each: I.eggDropStagger, from: 'end' } }, .2)
      .to(p, { v: .6, duration: .08, onUpdate: set }, I.lampOnAt).to(p, { v: .1, duration: .1, onUpdate: set })
      .to(p, { v: .85, duration: .08, onUpdate: set }).to(p, { v: .3, duration: .12, onUpdate: set })
      .to(p, { v: 1, duration: .6, ease: 'power2.out', onUpdate: set })
      .from('.hero-title .ch', { yPercent: 120, opacity: 0, stagger: .06, duration: .9, ease: 'expo.out' }, I.textAt)
      .from('#hero-stamp', { scale: 2.6, opacity: 0, rotate: -30, duration: .45, ease: 'power4.in' }, I.textAt + .5)
      .from('.hero-lead, .hero-actions', { y: 24, opacity: 0, stagger: .1, duration: .8, ease: 'expo.out' }, I.textAt + .4)
      .from('.site-top > *', { y: -20, opacity: 0, stagger: .1, duration: .8, ease: 'expo.out' }, I.textAt + .2);
    if (reduce) { tl.progress(1); power = 1; }
  }

  function wobble() {
    keyEggs.forEach((el, i) => {
      const path = el.querySelector('.crack path'), len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      if (!reduce) gsap.timeline({ repeat: -1, repeatDelay: C.wobble.repeatDelay + i * 1.3, delay: C.wobble.firstDelay + i })
        .to(el, { rotate: '+=7', duration: .07, yoyo: true, repeat: 5, ease: 'sine.inOut' })
        .to(el, { y: -4, duration: .12, yoyo: true, repeat: 1 }, '<');
      el.addEventListener('click', () => {
        gsap.timeline().to(el, { scale: 1.08, duration: .08, yoyo: true, repeat: 3 })
          .to(path, { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, 0)
          .to(path, { strokeDashoffset: len, duration: .6, delay: 1.4 });
        document.getElementById('works').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function init(works) {
    hero = document.getElementById('top'); dark = document.getElementById('dark'); glow = document.getElementById('glow');
    ring = document.getElementById('ring'); tag = document.getElementById('tag');
    document.getElementById('hero-stamp').textContent = `${C.studio.founded} ${C.studio.stampPrefix} 01`;
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
    setTimeout(measure, 2600); // 알이 다 놓인 뒤 위치를 다시 잰다
    document.addEventListener('langchange', () => setTimeout(measure, 50));
  }
  return { init };
})();
