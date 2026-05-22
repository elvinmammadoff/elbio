/**
 * ELBIO — Project Loader
 * Reads ?project=<slug> from URL, fetches projects.json, and populates
 * all [data-project-field] elements in project-single.html.
 *
 * Fallback: if no slug param or no match, renders first project from JSON.
 *
 * Field hooks (data-project-field values):
 *   title          → element.textContent (also updates <title> and meta description)
 *   role           → element.textContent
 *   year           → element.textContent
 *   tags           → element.textContent (joined with ", ")
 *   title-short    → element.textContent (first word of title used as client name)
 *   challenge      → element.textContent
 *   challenge-heading → element.textContent (derived from challenge first sentence)
 *   solution       → element.textContent
 *   solution-heading  → element.textContent (derived from solution first sentence)
 *   cover          → element.src (for <img>)
 *   results        → replaces children with .case-result-item list items
 *   results-heading → element.textContent
 *   tech           → replaces children with .tech-badge spans
 *
 * Nav hooks:
 *   data-project-prev → sets href and .project-nav-title text to previous project
 *   data-project-next → sets href and .project-nav-title text to next project
 */

(function () {
  'use strict';

  var DATA_PATH = 'assets/data/projects.json';

  function getSlug() {
    var search = window.location.search;
    if (!search) return null;
    var params = new URLSearchParams(search);
    return params.get('project') || null;
  }

  function populate(project, allProjects) {
    var idx = allProjects.findIndex(function (p) { return p.slug === project.slug; });

    /* ---- Page title & meta ---- */
    document.title = project.title + ' | Elbio';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', project.description);

    /* ---- data-project-field elements ---- */
    document.querySelectorAll('[data-project-field]').forEach(function (el) {
      var field = el.getAttribute('data-project-field');

      switch (field) {
        case 'title':
          // Rebuild word-wrap spans for word-mask animation
          el.innerHTML = buildWordMaskTitle(project.title);
          break;

        case 'role':
          el.textContent = project.role;
          break;

        case 'year':
          el.textContent = project.year;
          break;

        case 'tags':
          el.textContent = project.tags.join(', ');
          break;

        case 'title-short':
          // Use the first segment before " — " as the client name
          el.textContent = project.title.split(' — ')[0];
          break;

        case 'description':
          el.textContent = project.description;
          break;

        case 'challenge':
          el.textContent = project.challenge;
          break;

        case 'challenge-heading':
          // First sentence of challenge as the heading
          el.textContent = firstSentence(project.challenge);
          break;

        case 'solution':
          el.textContent = project.solution;
          break;

        case 'solution-heading':
          el.textContent = firstSentence(project.solution);
          break;

        case 'cover':
          if (el.tagName === 'IMG') {
            el.src = project.images.cover;
            el.alt = project.title + ' — project cover';
          }
          break;

        case 'gallery':
          buildGallery(el, project);
          break;

        case 'results':
          buildResults(el, project.results);
          break;

        case 'results-heading':
          el.textContent = project.results[0] || 'Results.';
          break;

        case 'tech':
          buildTech(el, project.tech);
          break;
      }
    });

    /* ---- Prev / Next nav ---- */
    var prevEl = document.querySelector('[data-project-prev]');
    var nextEl = document.querySelector('[data-project-next]');

    var prevProject = idx > 0 ? allProjects[idx - 1] : allProjects[allProjects.length - 1];
    var nextProject = idx < allProjects.length - 1 ? allProjects[idx + 1] : allProjects[0];

    if (prevEl) {
      prevEl.href = 'project-single.html?project=' + prevProject.slug;
      var prevTitle = prevEl.querySelector('.project-nav-title');
      if (prevTitle) prevTitle.textContent = prevProject.title;
    }

    if (nextEl) {
      nextEl.href = 'project-single.html?project=' + nextProject.slug;
      var nextTitle = nextEl.querySelector('.project-nav-title');
      if (nextTitle) nextTitle.textContent = nextProject.title;
    }
  }

  /* ---- Helpers ---- */

  function firstSentence(text) {
    var match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0] : text.slice(0, 80);
  }

  function buildWordMaskTitle(title) {
    // Strip " — Subtitle" from title for the hero display
    var displayTitle = title.split(' — ')[0];
    // Split into words, each wrapped for word-mask reveal
    return displayTitle.split(' ').map(function (word) {
      return '<span class="word-wrap"><span class="word">' + escHtml(word) + '</span></span>';
    }).join('\n          ');
  }

  function buildResults(container, results) {
    container.innerHTML = results.map(function (result) {
      // Try to split "metric label — detail" or just show the whole string
      var parts = result.split(/\s*—\s*/);
      var metric = '';
      var label = '';
      var desc = '';

      if (parts.length >= 2) {
        // First part: metric value + label, second part: detail
        var labelParts = parts[0].match(/^([^\s]+)\s+(.+)$/);
        if (labelParts) {
          metric = labelParts[1];
          label = labelParts[2];
        } else {
          metric = parts[0];
        }
        desc = parts[1];
      } else {
        label = result;
      }

      return '<li class="case-result-item">' +
        (metric ? '<span class="case-result-metric">' + escHtml(metric) + '</span>' : '') +
        '<div class="case-result-body">' +
          (label ? '<strong class="case-result-title">' + escHtml(label) + '</strong>' : '') +
          (desc ? '<span class="case-result-desc">' + escHtml(desc) + '</span>' : '') +
        '</div>' +
        '</li>';
    }).join('');
  }

  function buildTech(container, tech) {
    container.innerHTML = tech.map(function (t) {
      return '<span class="tech-badge">' + escHtml(t) + '</span>';
    }).join('');
  }

  function buildGallery(container, project) {
    var gallery = project.images.gallery || [];
    container.innerHTML =
      '<div class="mockup-grid-featured">' +
        '<img src="' + gallery[0] + '" alt="' + escHtml(project.title) + ' mockup 1" loading="lazy">' +
      '</div>' +
      '<div class="mockup-grid-row">' +
        (gallery[1] ? '<div class="mockup-grid-item"><img src="' + gallery[1] + '" alt="' + escHtml(project.title) + ' mockup 2" loading="lazy"></div>' : '') +
        (gallery[2] ? '<div class="mockup-grid-item"><img src="' + gallery[2] + '" alt="' + escHtml(project.title) + ' mockup 3" loading="lazy"></div>' : '') +
      '</div>';
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- Boot ---- */
  function init() {
    var slug = getSlug();

    fetch(DATA_PATH)
      .then(function (res) { return res.json(); })
      .then(function (projects) {
        if (!projects || !projects.length) return;

        var project = null;
        if (slug) {
          project = projects.find(function (p) { return p.slug === slug; }) || null;
        }
        // Fallback to first project
        if (!project) project = projects[0];

        populate(project, projects);
      })
      .catch(function (err) {
        // Fail silently — static HTML fallback (Lumora) remains intact
        console.warn('[project-loader] Could not load projects.json:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
