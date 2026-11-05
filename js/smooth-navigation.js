(() => {
  'use strict';

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
