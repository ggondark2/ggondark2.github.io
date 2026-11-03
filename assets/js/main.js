// 시작 순서: 사전 → 작품 데이터 → 각 장면
(async () => {
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  await I18N.ready;
  const works = await Works.load();
  Works.render();
  Hero.init(works);
  Hatch.init();
  Works.reveal();

  // 상단 막대: 첫 화면을 벗어나면 배경을 깐다
  const top = document.querySelector('.site-top');
  const solid = () => top.classList.toggle('solid', scrollY > innerHeight * .8);
  addEventListener('scroll', solid, { passive: true }); solid();

  // 문의
  const email = SITE_CONFIG.studio.email;
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = 'mailto:' + email; });
  const mail = document.getElementById('mail'); mail.textContent = email;
  const copied = document.getElementById('copied');
  document.getElementById('copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      copied.innerHTML = `<svg class="ico"><use href="#i-check"/></svg>${I18N.t('contact.copied')}`;
    } catch (e) {
      copied.textContent = I18N.t('contact.copyFail');
      getSelection().selectAllChildren(mail);
    }
    copied.classList.add('show'); clearTimeout(copied.timer); copied.timer = setTimeout(() => copied.classList.remove('show'), 2400);
  });
  if (!reduce) {
    gsap.from('#contact-title, .contact-lead', { yPercent: 40, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 75%' } });
    gsap.from('.mail', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 65%' } });
    gsap.from('.contact-actions', { y: 20, opacity: 0, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 60%' } });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})().catch(err => { console.error(err); });
