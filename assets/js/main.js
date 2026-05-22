/**
 * ELBIO — Main Bootstrap
 * Wires up: nav scroll state, mobile menu, theme toggle (handled by
 * theme-init.js), footer year, project filter chips, and imports
 * team-motion's entry point (assets/js/motion/index.js).
 *
 * data-motion and data-cursor attributes on elements are no-ops
 * until team-motion's runtime loads. No JS errors if motion
 * scripts are absent.
 */

(function () {
  'use strict';

  /* ===========================================================
     NAV — scroll state
     =========================================================== */
  function initNav() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var scrollThreshold = 60;
    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > scrollThreshold) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ===========================================================
     MOBILE MENU
     =========================================================== */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      toggle.classList.add('is-open');
      mobileNav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      toggle.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on mobile nav link click (but not dropdown toggle buttons)
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on dedicated close button (used on contact.html)
    var closeBtn = mobileNav.querySelector('.mobile-nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on outside click (backdrop)
    document.addEventListener('click', function (e) {
      if (isOpen && !mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ===========================================================
     ACTIVE NAV LINK
     =========================================================== */
  function initActiveNavLink() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var linkPage = href.split('/').pop();

      if (
        linkPage === currentPath ||
        (currentPath === '' && linkPage === 'index.html') ||
        (currentPath === 'index.html' && linkPage === '')
      ) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ===========================================================
     FOOTER — current year
     =========================================================== */
  function initFooterYear() {
    var yearEls = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ===========================================================
     PROJECT FILTER CHIPS
     =========================================================== */
  function initProjectFilter() {
    var chips = document.querySelectorAll('.filter-chip');
    var cards = document.querySelectorAll('.project-card[data-tags]');

    if (!chips.length || !cards.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.getAttribute('data-filter') || 'all';

        // Update active state
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');

        // Filter cards
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(',').map(function (t) {
            return t.trim().toLowerCase();
          });

          var visible = filter === 'all' || tags.indexOf(filter.toLowerCase()) !== -1;

          // Use visibility + height transition for smooth show/hide
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          if (visible) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.pointerEvents = '';
            card.style.display = '';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.97)';
            card.style.pointerEvents = 'none';
            // Brief delay before hiding completely so transition is visible
            (function (c) {
              setTimeout(function () {
                if (c.style.opacity === '0') {
                  c.style.display = 'none';
                }
              }, 320);
            })(card);
          }
        });
      });
    });
  }

  /* ===========================================================
     MOBILE NAV DROPDOWNS
     =========================================================== */
  function initMobileDropdowns() {
    document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.mobile-nav-item.has-dropdown');
        if (!item) return;
        var isOpen = item.classList.contains('is-open');
        // Close all others
        document.querySelectorAll('.mobile-nav-item.has-dropdown.is-open').forEach(function (el) {
          el.classList.remove('is-open');
          el.querySelector('.mobile-nav-toggle').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ===========================================================
     SMOOTH ANCHOR SCROLL (fallback when Lenis is absent)
     =========================================================== */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href').slice(1);
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (!target) return;

        // If Lenis is running, it intercepts; otherwise use native
        if (!window.lenis) {
          e.preventDefault();
          var headerH = document.querySelector('.site-header')
            ? document.querySelector('.site-header').offsetHeight
            : 0;
          var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ===========================================================
     BOOT
     =========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initMobileMenu();
    initMobileDropdowns();
    initActiveNavLink();
    initFooterYear();
    initProjectFilter();
    initAnchorScroll();
  });

})();
