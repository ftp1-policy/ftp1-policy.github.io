(function () {
  'use strict';

  /* ---------- Sticky nav: add .scrolled class after 60px ---------- */
  const nav = document.getElementById('topnav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reuse hero CTA links in nav and footer ---------- */
  const sharedLinkSource = document.querySelector('[data-shared-links-source]');
  const sharedLinkTargets = document.querySelectorAll('[data-shared-links-target]');

  function syncSharedLinks() {
    if (!sharedLinkSource || !sharedLinkTargets.length) return;

    const sourceLinks = Array.from(sharedLinkSource.querySelectorAll('a')).map(function (link) {
      return {
        href: link.getAttribute('href') || '#',
        label: (link.textContent || '').trim(),
        target: link.getAttribute('target'),
        rel: link.getAttribute('rel')
      };
    });

    sharedLinkTargets.forEach(function (list) {
      list.replaceChildren();

      sourceLinks.forEach(function (item) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        if (item.target) a.target = item.target;
        if (item.rel) a.rel = item.rel;
        li.appendChild(a);
        list.appendChild(li);
      });
    });
  }

  syncSharedLinks();

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  /* ---------- Lock placeholder "#" anchors so the page does not jump ---------- */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  /* ---------- Force all videos to stay silent ---------- */
  document.querySelectorAll('video').forEach(function (video) {
    function enforceMuted() {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
    }

    enforceMuted();
    video.addEventListener('volumechange', enforceMuted);
    video.addEventListener('loadedmetadata', enforceMuted);
    video.addEventListener('play', enforceMuted);
  });

  /* ---------- Toast helper ---------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  /* ---------- BibTeX copy-to-clipboard ---------- */
  const copyBtn = document.getElementById('copyBibtex');
  const bibtexBlock = document.getElementById('bibtexBlock');

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  if (copyBtn && bibtexBlock) {
    copyBtn.addEventListener('click', function () {
      const text = bibtexBlock.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { showToast('BibTeX copied to clipboard.'); },
          function () {
            if (fallbackCopy(text)) showToast('BibTeX copied to clipboard.');
            else showToast('Copy failed. Please select and copy manually.');
          }
        );
      } else if (fallbackCopy(text)) {
        showToast('BibTeX copied to clipboard.');
      } else {
        showToast('Copy failed. Please select and copy manually.');
      }
    });
  }
})();
