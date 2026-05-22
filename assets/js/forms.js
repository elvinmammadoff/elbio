/**
 * ELBIO — Forms
 * Web3Forms submission with fetch, client-side validation,
 * and success/error state management.
 *
 * Web3Forms endpoint: https://api.web3forms.com/submit
 * Set your access key via data-web3forms-key attribute on the <form>.
 */

(function () {
  'use strict';

  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  /**
   * Show a status message in the form's .form-status element.
   * @param {HTMLElement} form
   * @param {'success'|'error'} type
   * @param {string} message
   */
  function showStatus(form, type, message) {
    var statusEl = form.querySelector('.form-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = 'form-status is-' + type;

    // Auto-clear success message after 6 seconds
    if (type === 'success') {
      setTimeout(function () {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }, 6000);
    }
  }

  /**
   * Basic client-side validation.
   * Returns an array of error messages (empty = valid).
   * @param {HTMLFormElement} form
   * @returns {string[]}
   */
  function validateForm(form) {
    var errors = [];
    var fields = form.querySelectorAll('[required]');

    fields.forEach(function (field) {
      var value = field.value.trim();
      var label = field.getAttribute('aria-label') || field.getAttribute('name') || 'Field';

      if (!value) {
        errors.push(label + ' is required.');
        field.setAttribute('aria-invalid', 'true');
        return;
      }

      field.removeAttribute('aria-invalid');

      // Email validation
      if (field.type === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Please enter a valid email address.');
          field.setAttribute('aria-invalid', 'true');
        }
      }
    });

    return errors;
  }

  /**
   * Clear all aria-invalid states on the form.
   * @param {HTMLFormElement} form
   */
  function clearValidationState(form) {
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  /**
   * Set submit button loading state.
   * @param {HTMLButtonElement} btn
   * @param {boolean} loading
   */
  function setLoadingState(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.setAttribute('data-original-text', btn.textContent);
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    } else {
      var original = btn.getAttribute('data-original-text');
      if (original) btn.textContent = original;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  }

  /**
   * Handle form submission.
   * @param {Event} event
   */
  function handleSubmit(event) {
    event.preventDefault();

    var form = event.currentTarget;
    var submitBtn = form.querySelector('[type="submit"]');

    clearValidationState(form);

    // Client-side validation
    var errors = validateForm(form);
    if (errors.length > 0) {
      showStatus(form, 'error', errors[0]);
      // Focus the first invalid field
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Get access key
    var accessKey = form.getAttribute('data-web3forms-key') || '';
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      showStatus(form, 'error', 'Contact form is not configured yet. Please set up a Web3Forms access key.');
      return;
    }

    setLoadingState(submitBtn, true);

    // Build FormData — Web3Forms accepts multipart or JSON
    var formData = new FormData(form);

    // Inject access key if not already a hidden field in the form
    if (!form.querySelector('input[name="access_key"]')) {
      formData.append('access_key', accessKey);
    }

    // Optionally mark as JSON response for cleaner parsing
    formData.append('botcheck', ''); // honeypot — leave empty

    fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setLoadingState(submitBtn, false);

        if (data.success) {
          showStatus(form, 'success', data.message || 'Your message has been sent. I\'ll get back to you soon!');
          form.reset();
        } else {
          showStatus(form, 'error', data.message || 'Something went wrong. Please try again.');
        }
      })
      .catch(function (err) {
        setLoadingState(submitBtn, false);
        showStatus(form, 'error', 'Network error. Please check your connection and try again.');
        console.error('[ELBIO Forms] Submission error:', err);
      });
  }

  /**
   * Initialize all forms on the page that have data-web3forms-key.
   */
  function initForms() {
    var forms = document.querySelectorAll('form[data-web3forms-key], form.contact-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', handleSubmit);

      // Clear validation state on input
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.addEventListener('input', function () {
          field.removeAttribute('aria-invalid');
          var statusEl = form.querySelector('.form-status');
          if (statusEl && statusEl.classList.contains('is-error')) {
            statusEl.className = 'form-status';
            statusEl.textContent = '';
          }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initForms);

  // Expose for manual init after dynamic DOM injection
  window.ElbioForms = { init: initForms };
})();
