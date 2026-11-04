(() => {
  'use strict';

  const supportsViewTransitions = 'startViewTransition' in document;

  function initSmoothNavigation() {
    const navLinks = document.querySelectorAll(
      'a[href^="/"], a[href^="./"], a[href^="../"], a[href^="html/"], a[href$=".html"]'
    );

    navLinks.forEach(link => {
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      link.addEventListener('click', handleLinkClick);
    });
  }

  /**
   * Resolve a link href to an absolute pathname so we can compare it
   * reliably with the current page, regardless of whether the href is
   * "index.html", "./index.html", "../index.html", or just "/".
   */
  function resolvePathname(href) {
    try {
      return new URL(href, location.href).pathname;
    } catch {
      return null;
    }
  }

  /**
   * Check whether two pathnames point to the same page.
   * Treats "/", "/index.html", and any path ending in "/index.html" as
   * equivalent when they share the same directory.
   */
  function isSamePage(href) {
    const target = resolvePathname(href);
    if (!target) return false;

    const current = location.pathname;
    if (target === current) return true;

    // Normalise: strip trailing "index.html" and trailing slash
    const norm = p => p.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
    return norm(target) === norm(current);
  }

  function handleLinkClick(event) {
    const href = event.currentTarget.getAttribute('href');

    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;

    // If the link points to the page we're already on,
    // just scroll to top — no reload, no transition, no white flash.
    if (isSamePage(href)) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    event.preventDefault();

    if (supportsViewTransitions && document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = href;
      });
    } else {
      document.body.style.opacity = '0';
      document.body.style.transform = 'scale(0.98)';
      document.body.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    }
  }

  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.classList.remove('no-transition');
      document.body.classList.add('page-loaded');
      document.body.style.opacity = '';
      document.body.style.transform = '';
      document.body.style.transition = '';
    }
  });

  window.addEventListener('popstate', () => {
    if (supportsViewTransitions && document.startViewTransition) {
      document.startViewTransition(() => window.location.reload());
    }
  });

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothNavigation);
  } else {
    initSmoothNavigation();
  }

  let prefetchTimer;
  document.addEventListener('mouseover', event => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && (href.endsWith('.html') || href.includes('html/'))) {
      clearTimeout(prefetchTimer);
      prefetchTimer = setTimeout(() => {
        if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = href;
        prefetch.as = 'document';
        document.head.appendChild(prefetch);
      }, 100);
    }
  });
})();
