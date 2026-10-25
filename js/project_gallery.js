(() => {
  const grid = document.querySelector(".project-gallery__grid");

  if (!grid) return;

  const scrollStorageKey = `project-gallery-scroll:${window.location.pathname}`;

  document.querySelectorAll(".navbar a[href]").forEach((link) => {
    const target = new URL(link.href, window.location.href);

    if (
      target.origin === window.location.origin &&
      target.pathname === window.location.pathname &&
      target.search === window.location.search &&
      !target.hash
    ) {
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });

  window.addEventListener("pagehide", () => {
    try {
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    } catch (error) {
      console.warn("Could not save project gallery scroll position.", error);
    }
  });

  window.addEventListener("pageshow", () => {
    try {
      const savedScrollY = sessionStorage.getItem(scrollStorageKey);
      if (savedScrollY === null) return;

      window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, Number(savedScrollY));
        root.style.scrollBehavior = previousScrollBehavior;
      });
    } catch (error) {
      console.warn("Could not restore project gallery scroll position.", error);
    }
  });

  let layoutFrame;

  const layoutCards = () => {
    window.cancelAnimationFrame(layoutFrame);
    layoutFrame = window.requestAnimationFrame(() => {
      const styles = window.getComputedStyle(grid);
      const rowHeight = Number.parseFloat(styles.gridAutoRows);
      const rowGap = Number.parseFloat(styles.rowGap);

      if (!rowHeight) return;

      grid.querySelectorAll(".project-gallery__card").forEach((card) => {
        const span = Math.ceil(
          (card.offsetHeight + rowGap) / (rowHeight + rowGap),
        );
        card.style.gridRowEnd = `span ${Math.max(1, span)}`;
      });
    });
  };

  grid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("load", layoutCards);
    image.addEventListener("error", () => {
      console.error(`Project gallery image failed to load: ${image.src}`);
      layoutCards();
    });

    if (image.complete) layoutCards();
  });
  window.addEventListener("resize", layoutCards, { passive: true });
  layoutCards();
})();
