// 부화 과정: 스크롤에 따라 검란 → 균열 → 부화. 파편 VFX는 진행도에 따라 결정적으로 그려 되감기도 자연스럽다.
window.Hatch = (() => {
  const C = window.SITE_CONFIG.hatch;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cv, x, W, H, dpr, origin = { x: 0, y: 0, s: 1 }, shards = [], fluff = [], dust = [];
  const tex = { shell: null, fluff: [], dust: null };

  // 시드 고정 난수: 새로고침해도 파편 모양이 같다
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

  function loadImg(src) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('[hatch] 이미지 로드 실패: ' + src)); i.src = src; }); }

  // 파편·솜털·먼지 텍스처: 실제 껍데기와 병아리 사진에서 떠 온다
  async function makeTextures() {
    const [shell, chick] = await Promise.all([loadImg('assets/img/shell-top.webp'), loadImg('assets/img/chick.webp')]);
    tex.shell = shell;
    const r = rng(11);
    for (let k = 0; k < 6; k++) {
      const c = document.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d');
      g.drawImage(chick, chick.width * (.3 + r() * .35), chick.height * (.42 + r() * .25), 34, 34, 0, 0, 48, 48);
      g.globalCompositeOperation = 'destination-in';
      const m = g.createRadialGradient(24, 24, 2, 24, 24, 24); m.addColorStop(0, '#000'); m.addColorStop(.55, 'rgba(0,0,0,.6)'); m.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = m; g.fillRect(0, 0, 48, 48); tex.fluff.push(c);
    }
    const d = document.createElement('canvas'); d.width = d.height = 128; const g = d.getContext('2d');
    for (let k = 0; k < 70; k++) {
      const a = r() * 6.283, rr = r() * 44, px = 64 + Math.cos(a) * rr, py = 64 + Math.sin(a) * rr, sz = 10 + r() * 22;
      const m = g.createRadialGradient(px, py, 0, px, py, sz); m.addColorStop(0, 'rgba(232,214,184,.22)'); m.addColorStop(1, 'rgba(232,214,184,0)');
      g.fillStyle = m; g.fillRect(px - sz, py - sz, sz * 2, sz * 2);
    }
    tex.dust = d;
  }

  function makeParticles() {
    const r = rng(7);
    shards = Array.from({ length: C.shards }, () => {
      const a = -Math.PI / 2 + (r() - .5) * Math.PI * 1.5, sp = 380 + r() * 620, n = 3 + (r() * 3 | 0), size = 6 + r() * 16;
      const pts = Array.from({ length: n }, (_, k) => { const aa = k / n * Math.PI * 2 + r() * .6; return [Math.cos(aa) * size * (.5 + r() * .5), Math.sin(aa) * size * (.5 + r() * .5)]; });
      return { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vr: (r() - .5) * 18, pts, size, tu: .2 + r() * .6, tv: .2 + r() * .5, ox: (r() - .5) * 120 };
    });
    fluff = Array.from({ length: C.fluff }, () => ({ vx: (r() - .5) * 260, vy: -80 - r() * 260, ph: r() * 6, s: 5 + r() * 9, ox: (r() - .5) * 100, oy: (r() - .5) * 40, k: r() * 6 | 0, vr: (r() - .5) * 3 }));
    dust = Array.from({ length: C.dust }, () => ({ a: Math.PI + r() * Math.PI, sp: 60 + r() * 160, s: .6 + r() * .9, delay: r() * .25 }));
  }

  function size() {
    dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cr = cv.getBoundingClientRect(), nr = document.querySelector('.nest').getBoundingClientRect();
    origin = { x: nr.left - cr.left + nr.width / 2, y: nr.top - cr.top + nr.height * .48, s: nr.width / 330, floor: nr.bottom - cr.top };
  }

  // t: 0~1 파열 진행도. 코어 섬광 → 충격 고리 → 껍데기 파편 → 솜털 → 바닥 먼지로 소멸
  function draw(t) {
    x.clearRect(0, 0, W, H);
    if (t <= 0 || t >= 1 || !tex.shell) return;
    const T = t * 1.3, s = origin.s, ox = origin.x, oy = origin.y, g = 1400;
    // 코어 섬광
    const fa = Math.max(0, 1 - t * 5);
    if (fa > 0) { const rr = 220 * s * (0.4 + t * 3), gr = x.createRadialGradient(ox, oy, 0, ox, oy, rr);
      gr.addColorStop(0, `rgba(255,248,220,${fa})`); gr.addColorStop(.4, `rgba(255,190,90,${fa * .6})`); gr.addColorStop(1, 'rgba(255,140,40,0)');
      x.fillStyle = gr; x.beginPath(); x.arc(ox, oy, rr, 0, 7); x.fill(); }
    // 충격 고리
    const ra = Math.max(0, 1 - t * 2.2);
    if (ra > 0) { x.strokeStyle = `rgba(255,214,150,${ra})`; x.lineWidth = 2 + ra * 8; x.beginPath(); x.ellipse(ox, oy, 40 * s + T * 520 * s, (40 * s + T * 520 * s) * .42, 0, 0, 7); x.stroke(); }
    // 바닥 먼지: 파편이 떨어진 자리에서 퍼지며 사라진다
    dust.forEach(d => {
      const k = Math.max(0, (t - .25 - d.delay) / .75); if (k <= 0) return;
      const px = ox + Math.cos(d.a) * d.sp * k * s * 2.2, py = origin.floor - 8 * s + Math.sin(d.a) * d.sp * k * s * .35, sz = 128 * d.s * s * (.6 + k * 1.4);
      x.globalAlpha = Math.sin(k * Math.PI) * .9; x.drawImage(tex.dust, px - sz / 2, py - sz / 2, sz, sz);
    });
    x.globalAlpha = 1;
    // 껍데기 파편: 실제 껍데기 질감을 다각형으로 오려 낸다
    const fade = t > .65 ? 1 - (t - .65) / .35 : 1, sh = tex.shell;
    shards.forEach(p => {
      const px = ox + p.ox * s * .3 + p.vx * T * s, py = Math.min(origin.floor, oy + (p.vy * T + .5 * g * T * T) * s);
      x.save(); x.translate(px, py); x.rotate(p.vr * T); x.globalAlpha = fade;
      x.beginPath(); p.pts.forEach(([a, b], k) => k ? x.lineTo(a * s, b * s) : x.moveTo(a * s, b * s)); x.closePath();
      x.save(); x.clip();
      const R = p.size * s * 1.1, sw = sh.width * .18;
      x.drawImage(sh, sh.width * p.tu, sh.height * p.tv, sw, sw, -R, -R, R * 2, R * 2);
      x.restore();
      x.strokeStyle = 'rgba(90,60,30,.45)'; x.lineWidth = 1; x.stroke(); x.restore();
    });
    // 솜털
    fluff.forEach(f => {
      const px = ox + f.ox * s + f.vx * T * s + Math.sin(T * 6 + f.ph) * 14 * s, py = oy + f.oy * s + f.vy * T * s + 60 * T * T * s, z = f.s * s * 2.4;
      x.save(); x.translate(px, py); x.rotate(f.vr * T); x.globalAlpha = Math.max(0, 1 - t * 1.1);
      x.drawImage(tex.fluff[f.k], -z / 2, -z / 2, z, z); x.restore();
    });
    x.globalAlpha = 1;
  }

  function init() {
    cv = document.getElementById('fx'); x = cv.getContext('2d');
    makeParticles(); size(); addEventListener('resize', size);
    makeTextures().catch(e => console.error(e));
    const crack = document.getElementById('h-crack'), len = crack.getTotalLength();
    crack.style.strokeDasharray = len; crack.style.strokeDashoffset = len;
    const stages = [...document.querySelectorAll('.stage')];
    const setStage = n => stages.forEach((s, i) => s.classList.toggle('on', i <= n));
    const stageEl = document.getElementById('hatch-stage'), fx = { t: 0 };

    if (reduce) {
      setStage(2);
      gsap.set('#h-egg', { opacity: 0 }); gsap.set(['#h-bottom', '#h-chick'], { opacity: 1 });
      gsap.set('.studio-note', { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hatch', start: 'top top', end: () => '+=' + innerHeight * C.scrollLength, pin: '.hatch-pin', scrub: .7,
        onUpdate: self => { const p = self.progress; setStage(p < .33 ? 0 : p < .58 ? 1 : 2); },
        onRefresh: size,
      },
    });
    setStage(0);
    // 1. 검란: 불빛이 들어오고 속에 병아리 그림자
    tl.fromTo('#h-egg .candle', { opacity: 0 }, { opacity: 1, duration: 2 }, .3)
      .fromTo('#h-egg .embryo', { opacity: 0 }, { opacity: .55, duration: 2 }, .8)
      .fromTo(stageEl, { '--heat': 0 }, { '--heat': 1, duration: 2 }, .3)
      .to('#h-egg', { rotate: 2, duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.2)
    // 2. 균열: 들썩임이 커지며 금이 간다
      .to('#h-egg', { keyframes: { rotate: [0, -5, 6, -8, 9, -10, 10, -6, 0] }, duration: 2.4, ease: 'none' }, 3.4)
      .to('#h-egg', { keyframes: { y: [0, -6, 0, -10, 0, -14, 0] }, duration: 2.4 }, 3.4)
      .to(crack, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.in' }, 4.3)
    // 3. 부화: 껍데기가 갈라지고 파편과 솜털, 병아리가 솟는다
      .set('#h-egg', { opacity: 0 }, 6).set(['#h-bottom', '#h-top'], { opacity: 1 }, 6)
      .to(fx, { t: 1, duration: 1.8, onUpdate: () => draw(fx.t) }, 6)
      .fromTo('#h-top', { x: 0, y: 0, rotate: 0 }, { keyframes: { x: ['0%', '28%', '62%'], y: ['0%', '-120%', '-40%'], rotate: [0, 40, 95] }, duration: 1.8, ease: 'power1.out' }, 6)
      .to('#h-top', { opacity: 0, duration: .5 }, 7.3)
      .fromTo('#h-bottom', { y: 0, scaleY: 1 }, { keyframes: { scaleY: [1, .9, 1.04, 1] }, duration: .8 }, 6)
      .fromTo('#h-chick', { opacity: 0, yPercent: 35, scaleY: .7, scaleX: 1.1 }, { opacity: 1, yPercent: -8, scaleY: 1.08, scaleX: .96, duration: .7, ease: 'power2.out' }, 6.15)
      .to('#h-chick', { yPercent: 0, scaleY: 1, scaleX: 1, duration: .6, ease: 'back.out(3)' }, 6.85)
      .to('#h-bottom', { xPercent: 52, rotate: 12, y: '4%', duration: 1.2, ease: 'power2.out' }, 7.1)
      .to(stageEl, { '--heat': .45, duration: 1.4 }, 6.5)
      .fromTo('.studio-note', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 7.6)
      .to({}, { duration: 1.4 });
    // 부화 후 병아리는 가끔 고개를 갸웃한다
    gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: 2 })
      .to('#h-chick', { rotate: -7, duration: .22, ease: 'sine.out' })
      .to('#h-chick', { rotate: 4, duration: .3, ease: 'sine.inOut', delay: .5 })
      .to('#h-chick', { rotate: 0, duration: .25, ease: 'sine.in' });
  }
  return { init };
})();
