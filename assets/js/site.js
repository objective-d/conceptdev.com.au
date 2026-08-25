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
  var targets = [].slice.call(document.querySelectorAll('.reveal'));

  var show = function (el) { el.classList.add('is-visible'); };

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(show);
    return;
  }

  var onScreen = function (el) {
    var box = el.getBoundingClientRect();
    return box.top < window.innerHeight && box.bottom > 0;
  };

  /* Whatever is already on screen is shown outright rather than waited for.
     IntersectionObserver only reports on a page that is actually being
     painted, and a target whose callback never arrives would stay invisible
     for good — which, on a page whose content is one big reveal, is a blank
     page. The observer is left to do what it is good at: the rest, on scroll. */
  var pending = targets.filter(function (el) {
    if (!onScreen(el)) return true;
    show(el);
    return false;
  });

  if (!pending.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  pending.forEach(function (el) { observer.observe(el); });

  /* Backstop for the same failure below the fold: if the observer is not
     reporting, scrolling would never bring anything in. This costs one
     bounding-box read per remaining target per scroll, and takes itself off
     as soon as they are all shown. */
  var sweep = function () {
    pending = pending.filter(function (el) {
      if (el.classList.contains('is-visible')) return false;
      if (!onScreen(el)) return true;
      show(el);
      observer.unobserve(el);
      return false;
    });
    if (!pending.length) window.removeEventListener('scroll', sweep);
  };

  window.addEventListener('scroll', sweep, { passive: true });
}());

/* --- Lightbox ------------------------------------------------------------- */

/* Click a screenshot to see it full size. Built here rather than in the markup
   so a page with this file blocked keeps plain, working images. */
(function () {
  'use strict';

  /* `shot--nozoom` opts a shot out: some captures are already full size, so a
     larger view of them shows nothing more. */
  var shots = [].slice.call(document.querySelectorAll('main .shot:not(.shot--nozoom) img'));
  if (!shots.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Close">×</button><img alt="">';
  document.body.appendChild(box);

  var big = box.querySelector('img');
  var closeBtn = box.querySelector('.lightbox__close');
  var opener = null;

  var open = function (img, btn) {
    opener = btn;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  var shut = function () {
    if (box.hidden) return;
    box.hidden = true;
    big.removeAttribute('src');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };

  shots.forEach(function (img) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'shot__zoom';
    btn.setAttribute('aria-label', 'View larger: ' + (img.alt || 'screenshot'));
    img.parentNode.insertBefore(btn, img);
    btn.appendChild(img);
    btn.addEventListener('click', function () { open(img, btn); });
  });

  /* Anywhere but the image itself closes it, which covers the backdrop and
     the close button in one. */
  box.addEventListener('click', function (e) { if (e.target !== big) shut(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') { shut(); return; }
    /* The close button is the only stop while the dialog is up, so Tab holds
       focus there rather than wandering into the page behind it. */
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
  });
}());
