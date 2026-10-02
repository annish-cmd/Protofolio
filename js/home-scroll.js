(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const targets = new Set(
    document.querySelectorAll(
      ".hero__content, .hero__image-wrap, .section__header, .cta-banner__inner",
    ),
  );

  document
    .querySelectorAll(
      ".features-grid, .services-grid, .stats-grid, .portfolio-grid, .testi-grid",
    )
    .forEach((grid) => {
      Array.from(grid.children).forEach((item, index) => {
        item.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 4) * 80}ms`,
        );
        targets.add(item);
      });
    });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  targets.forEach((target) => {
    target.classList.add("scroll-reveal");
    observer.observe(target);
  });
})();
