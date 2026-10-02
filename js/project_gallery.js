(() => {
  const grid = document.querySelector(".project-gallery__grid");

  if (!grid) return;

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
  });
  window.addEventListener("resize", layoutCards, { passive: true });
  layoutCards();
})();
