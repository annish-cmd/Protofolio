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

  function handleLinkClick(event) {
    const href = event.currentTarget.getAttribute('href');

    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;

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
