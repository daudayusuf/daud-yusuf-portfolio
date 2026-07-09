/* ================================================================
   DAUDA YUSUF OLAMILEKAN — PORTFOLIO
   main.js
   ================================================================ */

(function () {
  'use strict';

  /* ── DOM refs ───────────────────────────────────────────────── */
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const navLinks   = document.querySelectorAll('.nav__links a[data-section]');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections   = document.querySelectorAll('section[id]');
  const fadeEls    = document.querySelectorAll('.fade-in');

  /* ── 1. STICKY NAV — shrink on scroll ───────────────────────── */
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* ── 2. ACTIVE NAV LINK — highlight current section ────────── */
  function setActiveLink() {
    let currentId = '';
    const offset = 120;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const sectionAttr = link.getAttribute('data-section');
      if (sectionAttr === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ── 3. SCROLL HANDLER (batched with rAF) ───────────────────── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavScroll();
        setActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* run once on load */
  handleNavScroll();
  setActiveLink();

  /* ── 4. HAMBURGER / MOBILE NAV ──────────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* Close on outside click */
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileNav();
  });

  /* ── 5. SMOOTH SCROLL for nav links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 6. INTERSECTION OBSERVER — fade-in on scroll ──────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeEls.forEach(el => observer.observe(el));

  /* ── 7. STAT COUNTER ANIMATION ──────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-card__number');

  function parseStatValue(text) {
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    return { num, suffix };
  }

  function animateCounter(el) {
    const { num, suffix } = parseStatValue(el.textContent);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      const current = Math.round(eased * num);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => statObserver.observe(el));

})();
