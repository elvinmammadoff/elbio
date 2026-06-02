/**
 * ELBIO — Theme Init
 * Reads theme preference from localStorage / prefers-color-scheme,
 * applies [data-theme] to <html> BEFORE paint to prevent FOUC.
 * Also provides the toggle binding wired up after DOMContentLoaded.
 *
 * Must be loaded as the FIRST script in <head> (non-deferred).
 */

(function () {
  var STORAGE_KEY = 'elbio-theme';

  /**
   * Resolve preferred theme.
   * Priority: localStorage (explicit user choice)
   *           → inline data-theme on <html> (per-page default)
   *           → prefers-color-scheme
   *           → 'dark' (fallback)
   */
  function getPreferredTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage blocked (private browsing, etc.) — fall through
    }

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Respect a page-level default declared as <html data-theme="…">
    // (e.g. the light-first Cream Editorial and Photography demos).
    var pageDefault = document.documentElement.getAttribute('data-theme');
    if (pageDefault === 'light' || pageDefault === 'dark') {
      return pageDefault;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark';
  }

  /**
   * Apply theme attribute to <html>.
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Persist theme to localStorage.
   */
  function persistTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // silent fail
    }
  }

  /**
   * Toggle between dark and light.
   */
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    persistTheme(next);

    // Update toggle button aria-label if present
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply immediately — before any render
  var initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Watch system preference changes (user changes OS theme while page is open)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        // Only auto-switch if user hasn't made an explicit preference
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) {}
        if (!stored) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      });
    }
  });

  // Expose to global scope for external use (e.g. preview page variant switcher)
  window.ElbioTheme = {
    toggle: toggleTheme,
    set: function (theme) {
      applyTheme(theme);
      persistTheme(theme);
    },
    get: function () {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
  };
})();
