/* Concept Development — progressive enhancement only.
   The site is fully readable and navigable with this file absent. */

(function () {
  'use strict';

  /* --- Sticky header hairline ------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var setScrolled = function () {
      header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* --- Mark the current page in the nav --------------------------------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* --- Reveal on scroll -------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  targets.forEach(function (el) { observer.observe(el); });
}());
