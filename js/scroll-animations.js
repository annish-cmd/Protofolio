(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  function init() {
    const targets = new Set();

    // Section elements
    const sectionSelectors = [
      '.section__header',
      '.about-story__content',
      '.about-story__image-wrap',
      '.portfolio-filter',
      '.spotlight',
      '.partners-marquee',
      '.cta-banner__inner',
      '.cert-note'
    ];

    document.querySelectorAll(sectionSelectors.join(', ')).forEach(el => targets.add(el));

    // Staggered grid items
    const gridSelectors = [
      '.features-grid',
      '.services-grid',
      '.stats-grid',
      '.portfolio-grid',
      '.portfolio-full-grid',
      '.testi-grid',
      '.brands-grid',
      '.mv-grid',
      '.about-stats-grid',
      '.cert-grid'
    ];

    document.querySelectorAll(gridSelectors.join(', ')).forEach(grid => {
      Array.from(grid.children).forEach((child, index) => {
        child.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
        targets.add(child);
      });
    });

    // Observer setup
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(target => {
      target.classList.add('scroll-reveal');
      observer.observe(target);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
