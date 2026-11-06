/* FORMVANT® – script.js (vanilla JS, no dependencies) */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Navigation ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => setMenu(false));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Hero video ---------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    if (reduceMotion) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }
    else {
      const p = heroVideo.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  /* ---------- Scroll-controlled product video ---------- */
  const track = document.getElementById('showTrack');
  const video = document.getElementById('scrubVideo');
  const bar = document.getElementById('progressBar');
  const hint = document.getElementById('scrollHint');
  const chapters = Array.from(document.querySelectorAll('.chapter'));

  if (track && video) {
    let loaded = false;
    let ready = false;
    let target = 0;      // wanted time (s)
    let current = 0;     // smoothed time (s)
    let running = false;
    let lastSet = -1;

    // Load the video only when the section is close to the viewport
    const loadVideo = () => {
      if (loaded) return;
      loaded = true;
      video.preload = 'auto';
      video.src = video.dataset.src;
      video.load();
    };
    if ('IntersectionObserver' in window) {
      const loadIO = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { loadVideo(); loadIO.disconnect(); }
      }, { rootMargin: '150% 0px' });
      loadIO.observe(track);
    } else { loadVideo(); }

    video.addEventListener('loadedmetadata', () => {
      ready = true;
      if (reduceMotion) { video.currentTime = video.duration * 0.5; return; }
      update();
    });

    const progress = () => {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    };

    const setChapters = (p) => {
      chapters.forEach((c, i) => {
        const start = parseFloat(c.dataset.at);
        const next = chapters[i + 1] ? parseFloat(chapters[i + 1].dataset.at) : 1.01;
        c.classList.toggle('on', p >= start && p < next - 0.04 + (i === chapters.length - 1 ? 0.05 : 0));
      });
    };

    const frame = () => {
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.004) current = target;
      // Only seek when the change is at least about one frame and no seek is pending
      if (!video.seeking && Math.abs(current - lastSet) >= 1 / 48) {
        video.currentTime = current;
        lastSet = current;
      }
      if (current !== target) requestAnimationFrame(frame);
      else running = false;
    };

    const update = () => {
      const p = progress();
      if (bar) bar.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      if (hint) hint.classList.toggle('hide', p > 0.03);
      setChapters(p);
      if (reduceMotion || !ready) return;
      target = p * Math.max(0, video.duration - 0.05);
      if (!running) { running = true; requestAnimationFrame(frame); }
    };

    // One rAF-throttled scroll handler
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Demo contact form (visual only) ---------- */
  const form = document.getElementById('demoForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'This form is a visual demo and sends nothing. Write to hello@formvant.studio instead.';
    });
  }
})();
