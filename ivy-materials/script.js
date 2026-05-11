/**
 * Ivy Materials — Minimalist Landing Page Scripts
 * Timer, Pre-sale logic, Animations, Accordions, Mobile menu, Smooth scroll
 */

(function () {
  'use strict';

  // ==========================================
  // CONFIG
  // ==========================================
  const PRESALE_DEADLINE = new Date('2026-04-25T23:59:59');
  const FULL_PRICE = '12 300 000 сум';

  // ==========================================
  // 1. PRE-SALE LOGIC
  // ==========================================
  function isPresaleActive() {
    return new Date() < PRESALE_DEADLINE;
  }

  function handlePresaleState() {
    const presaleElements = document.querySelectorAll('.presale-only');

    if (!isPresaleActive()) {
      presaleElements.forEach(el => el.classList.add('hidden'));
      const priceEl = document.getElementById('offer-price-value');
      if (priceEl) priceEl.textContent = FULL_PRICE;
    }
  }

  // ==========================================
  // 2. COUNTDOWN TIMER
  // ==========================================
  function updateTimers() {
    if (!isPresaleActive()) return;

    const now = new Date();
    const diff = PRESALE_DEADLINE - now;

    if (diff <= 0) {
      handlePresaleState();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    setTimerValues('hero', pad(days), pad(hours), pad(minutes), pad(seconds));
    setTimerValues('offer', pad(days), pad(hours), pad(minutes), pad(seconds));
  }

  function setTimerValues(prefix, d, h, m, s) {
    const dEl = document.getElementById(`${prefix}-days`);
    const hEl = document.getElementById(`${prefix}-hours`);
    const mEl = document.getElementById(`${prefix}-minutes`);
    const sEl = document.getElementById(`${prefix}-seconds`);

    if (dEl) dEl.textContent = d;
    if (hEl) hEl.textContent = h;
    if (mEl) mEl.textContent = m;
    if (sEl) sEl.textContent = s;
  }

  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ==========================================
  // 4. MOBILE MENU
  // ==========================================
  function initMobileMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 6. PRIZE COUNTER ANIMATION
  // ==========================================
  function initPrizeCounter() {
    const counters = document.querySelectorAll('.amount-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('en-US');
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('en-US');
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 7. FLOATING CTA
  // ==========================================
  function initFloatingCta() {
    const floatingCta = document.getElementById('floating-cta');
    if (!floatingCta) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 800) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ==========================================
  // 8. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = 60;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      });
    });
  }

  // ==========================================
  // 9. VIDEO MODAL (LIGHTBOX)
  // ==========================================
  function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const overlay = document.getElementById('video-modal-overlay');
    const closeBtn = document.getElementById('video-modal-close');
    const iframeContainer = document.getElementById('video-modal-iframe-container');
    const videoLinks = document.querySelectorAll('.video-card-link');

    if (!modal || !iframeContainer || !videoLinks.length) return;

    videoLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const videoId = link.getAttribute('data-video-id');
        if (!videoId) return;

        e.preventDefault();
        
        iframeContainer.innerHTML = `
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" 
            title="Video testimonial" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        iframeContainer.innerHTML = '';
      }, 400);
    };

    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    handlePresaleState();

    if (isPresaleActive()) {
      updateTimers();
      setInterval(updateTimers, 1000);
    }

    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    initPrizeCounter();
    initFloatingCta();
    initSmoothScroll();
    initVideoModal();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
