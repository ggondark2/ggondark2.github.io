// 부화 과정: 스크롤에 따라 검란 → 균열 → 부화. 파편 VFX는 진행도에 따라 결정적으로 그려 되감기도 자연스럽다.
window.Hatch = (() => {
  const C = window.SITE_CONFIG.hatch;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cv, x, W, H, dpr, origin = { x: 0, y: 0, s: 1 }, shards = [], fluff = [];

  // 시드 고정 난수: 새로고침해도 파편 모양이 같다
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

  function makeParticles() {
    const r = rng(7);
    shards = Array.from({ length: C.shards }, () => {
      const a = -Math.PI / 2 + (r() - .5) * Math.PI * 1.5, sp = 380 + r() * 620, n = 3 + (r() * 3 | 0), size = 6 + r() * 16;
      const pts = Array.from({ length: n }, (_, k) => { const aa = k / n * Math.PI * 2 + r() * .6; return [Math.cos(aa) * size * (.5 + r() * .5), Math.sin(aa) * size * (.5 + r() * .5)]; });
      return { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vr: (r() - .5) * 18, pts, c: r() > .4 ? '#f3eadc' : '#d9c7ab', ox: (r() - .5) * 120 };
    });
    fluff = Array.from({ length: C.fluff }, () => ({ vx: (r() - .5) * 260, vy: -80 - r() * 260, ph: r() * 6, s: 2 + r() * 4, ox: (r() - .5) * 100, oy: (r() - .5) * 40 }));
  }

  function size() {
    dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cr = cv.getBoundingClientRect(), nr = document.querySelector('.nest').getBoundingClientRect();
    origin = { x: nr.left - cr.left + nr.width / 2, y: nr.top - cr.top + nr.height * .48, s: nr.width / 330 };
  }

  // t: 0~1 파열 진행도
  function draw(t) {
    x.clearRect(0, 0, W, H);
    if (t <= 0 || t >= 1) return;
    const T = t * 1.3, s = origin.s, ox = origin.x, oy = origin.y, g = 1400;
    // 코어 섬광
    const fa = Math.max(0, 1 - t * 5);
    if (fa > 0) { const rr = 220 * s * (0.4 + t * 3), gr = x.createRadialGradient(ox, oy, 0, ox, oy, rr);
      gr.addColorStop(0, `rgba(255,248,220,${fa})`); gr.addColorStop(.4, `rgba(255,190,90,${fa * .6})`); gr.addColorStop(1, 'rgba(255,140,40,0)');
      x.fillStyle = gr; x.beginPath(); x.arc(ox, oy, rr, 0, 7); x.fill(); }
    // 충격 고리
    const ra = Math.max(0, 1 - t * 2.2);
    if (ra > 0) { x.strokeStyle = `rgba(255,214,150,${ra})`; x.lineWidth = 2 + ra * 8; x.beginPath(); x.ellipse(ox, oy, 40 * s + T * 520 * s, (40 * s + T * 520 * s) * .42, 0, 0, 7); x.stroke(); }
    // 껍데기 파편
    const fade = t > .65 ? 1 - (t - .65) / .35 : 1;
    shards.forEach(p => {
      const px = ox + p.ox * s * .3 + p.vx * T * s, py = oy + (p.vy * T + .5 * g * T * T) * s;
      x.save(); x.translate(px, py); x.rotate(p.vr * T); x.globalAlpha = fade;
      x.fillStyle = p.c; x.beginPath(); p.pts.forEach(([a, b], k) => k ? x.lineTo(a * s, b * s) : x.moveTo(a * s, b * s)); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(90,60,30,.35)'; x.lineWidth = 1; x.stroke(); x.restore();
    });
    // 솜털
    fluff.forEach(f => {
      const px = ox + f.ox * s + f.vx * T * s + Math.sin(T * 6 + f.ph) * 14 * s, py = oy + f.oy * s + f.vy * T * s + 60 * T * T * s;
      x.globalAlpha = Math.max(0, 1 - t * 1.1) * .9; x.fillStyle = '#ffe27a';
      x.beginPath(); x.arc(px, py, f.s * s, 0, 7); x.fill();
    });
    x.globalAlpha = 1;
  }

  function init() {
    cv = document.getElementById('fx'); x = cv.getContext('2d');
    makeParticles(); size(); addEventListener('resize', size);
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
  }
  return { init };
})();
