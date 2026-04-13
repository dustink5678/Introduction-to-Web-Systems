/**
 * McKinsey firm page — transitions, navigation overlay, and micro-interactions.
 * Scoped to mckinsey.html only.
 */
(function () {
  'use strict';

  const BODY_CLASS = 'mck-page-js';
  const EXIT_CLASS = 'mck-page-exit';
  const OVERLAY_ACTIVE = 'mck-page-overlay--active';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlay = document.getElementById('mck-page-overlay');
  const main = document.querySelector('main.firm-main');

  function isHtmlNavigationLink(anchor) {
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#')) return false;
    if (/^https?:\/\//i.test(href)) return false;
    return /\.html($|[?#])/i.test(href) || href === 'index.html';
  }

  function navigateWithOverlay(href) {
    if (!overlay || REDUCED) {
      window.location.href = href;
      return;
    }
    document.body.classList.add(EXIT_CLASS);
    overlay.classList.add(OVERLAY_ACTIVE);
    overlay.setAttribute('aria-hidden', 'false');
    window.setTimeout(function () {
      window.location.href = href;
    }, 320);
  }

  function bindOutboundLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }
        if (!isHtmlNavigationLink(a)) return;
        const href = a.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        navigateWithOverlay(href);
      });
    });
  }

  function bindInPageAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      a.addEventListener('click', function (e) {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        target.classList.add('mck-anchor-highlight');
        window.setTimeout(function () {
          target.classList.remove('mck-anchor-highlight');
        }, 1400);
      });
    });
  }

  function staggerReveal() {
    if (!main) return;

    var sequence = [
      { selector: '.firm-header', delay: 0 },
      { selector: '.firm-layout', delay: 90 },
      { selector: '#resources', delay: 180 },
    ];

    sequence.forEach(function (item) {
      var el = main.querySelector(item.selector);
      if (!el) return;
      el.classList.add('mck-reveal');
      if (REDUCED) {
        el.classList.add('mck-reveal--visible');
      } else {
        window.setTimeout(function () {
          el.classList.add('mck-reveal--visible');
        }, item.delay);
      }
    });
  }

  function bindSidebarInteractions() {
    var items = document.querySelectorAll('.path-item, .module-item');
    items.forEach(function (el) {
      function pulse() {
        el.classList.remove('mck-item-pulse');
        void el.offsetWidth;
        el.classList.add('mck-item-pulse');
      }

      el.addEventListener('click', pulse);
    });
  }

  function bindPressFeedback() {
    var selectors = ['.resources-btn', '.back-link', '.nav-btn-link', '.nav-logo-link'];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.addEventListener('pointerdown', function () {
          el.classList.add('mck-press');
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
          el.addEventListener(ev, function () {
            el.classList.remove('mck-press');
          });
        });
      });
    });
  }

  function bindResourceRipple() {
    var btn = document.querySelector('.resources-btn');
    if (!btn || REDUCED) return;

    btn.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var rect = btn.getBoundingClientRect();
      var r = document.createElement('span');
      r.className = 'mck-ripple';
      r.style.left = e.clientX - rect.left + 'px';
      r.style.top = e.clientY - rect.top + 'px';
      btn.appendChild(r);
      window.setTimeout(function () {
        r.remove();
      }, 650);
    });
  }

  function observeScrollPanels() {
    if (REDUCED || !window.IntersectionObserver) {
      document.querySelectorAll('.firm-panel, .firm-content-card').forEach(function (el) {
        el.classList.add('mck-io-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('mck-io-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    document.querySelectorAll('.firm-panel, .firm-content-card').forEach(function (el) {
      io.observe(el);
    });
  }

  function observeVideoEmbed() {
    var wrap = document.querySelector('.video-embed');
    if (!wrap || REDUCED) {
      if (wrap) wrap.classList.add('mck-video-ready');
      return;
    }

    if (!window.IntersectionObserver) {
      wrap.classList.add('mck-video-ready');
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('mck-video-ready');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
  }

  document.body.classList.add(BODY_CLASS);
  staggerReveal();
  observeScrollPanels();
  observeVideoEmbed();
  bindOutboundLinks();
  bindInPageAnchors();
  bindSidebarInteractions();
  bindPressFeedback();
  bindResourceRipple();
})();
