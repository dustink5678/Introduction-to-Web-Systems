/**
 * site.js — global enhancements for the static portal.
 * - Remember last visited firm (localStorage) and offer "Continue" on dashboard.
 * - Survey page: validate and show confirmation (no backend).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'gcc:lastFirmHref';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setStatus(el, message, status) {
    if (!el) return;
    el.textContent = message;
    if (status) el.dataset.status = status;
  }

  function initSurveyPage() {
    const form = $('#survey-form');
    if (!form) return;

    const statusEl = $('#survey-status');
    const confirmation = $('#survey-confirmation');

    function showConfirmation() {
      if (confirmation) confirmation.hidden = false;
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.dataset.status = '';
      }
      form.hidden = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = ($('#survey-name') && $('#survey-name').value.trim()) || '';
      const email = ($('#survey-email') && $('#survey-email').value.trim()) || '';
      const interest = ($('#survey-interest') && $('#survey-interest').value) || '';
      const experience = Array.from(form.querySelectorAll('input[name="experience"]')).some((r) => r.checked);
      const consent = ($('#survey-consent') && $('#survey-consent').checked) || false;
      const goals = ($('#survey-goals') && $('#survey-goals').value.trim()) || '';

      if (!name) return setStatus(statusEl, 'Please enter your name.', 'error');
      if (!email || !email.includes('@')) return setStatus(statusEl, 'Please enter a valid email.', 'error');
      if (!interest) return setStatus(statusEl, 'Please select an interest area.', 'error');
      if (!experience) return setStatus(statusEl, 'Please choose an experience level.', 'error');
      if (!goals) return setStatus(statusEl, 'Please tell us your goals (1–2 sentences).', 'error');
      if (!consent) return setStatus(statusEl, 'Please check the consent box.', 'error');

      showConfirmation();
    });
  }

  function initLastVisitedFirm() {
    // Store clicks on firm cards (dashboard).
    document.querySelectorAll('a.firm-card[href]').forEach((a) => {
      a.addEventListener('click', function () {
        const href = a.getAttribute('href');
        if (href) localStorage.setItem(STORAGE_KEY, href);
      });
    });

    // Also store the current firm page itself (helps if user arrives directly).
    const firmHeading = $('#firm-heading');
    if (firmHeading && window.location.pathname.endsWith('.html')) {
      const file = window.location.pathname.split('/').pop();
      if (file && file !== 'index.html') localStorage.setItem(STORAGE_KEY, file);
    }

    // Show continue CTA on dashboard.
    const continueCard = $('#continue-card');
    const continueLink = $('#continue-link');
    const href = localStorage.getItem(STORAGE_KEY);
    if (continueCard && continueLink && href && href !== 'index.html') {
      continueLink.setAttribute('href', href);
      continueCard.classList.add('is-visible');
    }
  }

  initLastVisitedFirm();
  initSurveyPage();
})();
